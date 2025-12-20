import chalk from 'chalk';
import { checkPRReadiness } from './status';
import { validateLastCommit } from './commit';
import { showBranchStatus } from './branch';
import { getCurrentBranch, isGitRepository } from '../utils/git';

/**
 * Comprehensive PR preparation check - runs all validations
 */
export function preparePR(): void {
  if (!isGitRepository()) {
    console.error(chalk.red('❌ Error:'), 'Not in a Git repository');
    process.exit(1);
  }

  const currentBranch = getCurrentBranch();
  if (!currentBranch) {
    console.error(chalk.red('❌ Error:'), 'Could not determine current branch');
    process.exit(1);
  }

  console.log(chalk.blue.bold('\n🚀 Preparing Pull Request Checklist\n'));
  console.log(chalk.gray(`Branch: ${currentBranch}\n`));

  let hasErrors = false;
  let hasWarnings = false;

  // 1. Check branch status
  console.log(chalk.blue('1️⃣  Checking branch status...'));
  try {
    showBranchStatus();
    console.log('');
  } catch (error: any) {
    hasErrors = true;
  }

  // 2. Check commit messages
  console.log(chalk.blue('2️⃣  Validating commit messages...'));
  try {
    validateLastCommit();
    console.log('');
  } catch (error: any) {
    hasErrors = true;
    console.log('');
  }

  // 3. Check PR readiness
  console.log(chalk.blue('3️⃣  Checking PR readiness...'));
  const status = checkPRReadiness();
  
  if (status.issues.length > 0) {
    hasErrors = true;
  }
  if (status.warnings.length > 0) {
    hasWarnings = true;
  }

  // Display results
  if (status.info.length > 0) {
    status.info.forEach(msg => {
      console.log(chalk.blue('ℹ️ '), msg);
    });
    console.log('');
  }

  if (status.issues.length > 0) {
    status.issues.forEach(issue => {
      console.log(chalk.red('❌'), issue);
    });
    console.log('');
  }

  if (status.warnings.length > 0) {
    status.warnings.forEach(warning => {
      console.log(chalk.yellow('⚠️ '), warning);
    });
    console.log('');
  }

  // Final verdict
  console.log(chalk.blue.bold('\n📋 Summary\n'));

  if (hasErrors) {
    console.log(chalk.red.bold('❌ Branch is NOT ready for Pull Request'));
    console.log(chalk.gray('\nPlease address the errors above before creating a PR.'));
    console.log(chalk.gray('\nSuggested next steps:'));
    console.log(chalk.gray('  1. Fix the issues listed above'));
    console.log(chalk.gray('  2. Run: git-workflow pr (again)'));
    console.log(chalk.gray('  3. Once ready, push and create PR'));
    process.exit(1);
  } else if (hasWarnings) {
    console.log(chalk.yellow.bold('⚠️  Branch is ready, but has warnings'));
    console.log(chalk.gray('\nConsider addressing warnings for best practices.'));
    console.log(chalk.gray('\nYou can proceed with:'));
    console.log(chalk.gray('  1. Push: git push origin ' + currentBranch));
    console.log(chalk.gray('  2. Create a Pull Request on GitHub/GitLab'));
  } else {
    console.log(chalk.green.bold('✅ Branch is ready for Pull Request!'));
    console.log(chalk.gray('\nNext steps:'));
    console.log(chalk.gray('  1. Push: git push origin ' + currentBranch));
    console.log(chalk.gray('  2. Create a Pull Request on GitHub/GitLab'));
    console.log(chalk.gray('\nTo sync before pushing:'));
    console.log(chalk.gray('  git-workflow sync'));
  }
}


