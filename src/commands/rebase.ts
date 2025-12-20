import { execSync } from 'child_process';
import chalk from 'chalk';
import { getIntegrationBranch, isGitRepository, hasUncommittedChanges } from '../utils/git';

export interface RebaseOptions {
  base?: string;
  interactive?: boolean;
}

/**
 * Helps with rebasing current branch onto base branch
 */
export function rebaseBranch(options: RebaseOptions = {}): void {
  if (!isGitRepository()) {
    console.error(chalk.red('❌ Error:'), 'Not in a Git repository');
    process.exit(1);
  }

  // Auto-detect base branch if not specified
  const detectedBranch = getIntegrationBranch();
  const { base, interactive = false } = { base: detectedBranch, ...options };

  try {
    execSync('git rev-parse --git-dir', { stdio: 'ignore' });
  } catch {
    console.error(chalk.red('❌ Error:'), 'Not in a Git repository');
    process.exit(1);
  }

  try {
    const currentBranch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf-8' }).trim();
    
    // Check for uncommitted changes
    if (hasUncommittedChanges()) {
      console.error(chalk.red('❌ Error:'), 'You have uncommitted changes. Commit or stash them first.');
      console.log(chalk.gray('   Stash: git stash'));
      console.log(chalk.gray('   Or commit: git commit -am "your message"'));
      process.exit(1);
    }

    console.log(chalk.blue(`📥 Fetching latest changes from origin...`));
    execSync(`git fetch origin ${base}`, { stdio: 'inherit' });

    // Check if base branch exists
    try {
      execSync(`git rev-parse origin/${base}`, { stdio: 'ignore' });
    } catch {
      console.error(chalk.red(`❌ Error: Remote branch origin/${base} not found`));
      process.exit(1);
    }

    console.log(chalk.blue(`🔄 Rebasing ${currentBranch} onto origin/${base}...`));
    
    const rebaseCommand = interactive 
      ? `git rebase -i origin/${base}`
      : `git rebase origin/${base}`;

    execSync(rebaseCommand, { stdio: 'inherit' });

    console.log(chalk.green(`✅ Successfully rebased ${currentBranch} onto origin/${base}`));
    
    if (!interactive) {
      console.log(chalk.gray('\nIf you need to push, you may need to force push:'));
      console.log(chalk.gray(`  git push --force-with-lease origin ${currentBranch}`));
      console.log(chalk.yellow('\n⚠️  Only force push if you\'re the only one working on this branch!'));
    }

  } catch (error: any) {
    if (error.status === 1) {
      // Rebase conflict or aborted
      console.log(chalk.yellow('\n⚠️  Rebase encountered issues.'));
      console.log(chalk.gray('\nTo resolve conflicts:'));
      console.log(chalk.gray('  1. Fix conflicts in the files shown above'));
      console.log(chalk.gray('  2. Stage resolved files: git add <file>'));
      console.log(chalk.gray('  3. Continue rebase: git rebase --continue'));
      console.log(chalk.gray('\nTo abort: git rebase --abort'));
      process.exit(1);
    } else {
      console.error(chalk.red('❌ Error during rebase:'), error.message);
      process.exit(1);
    }
  }
}

