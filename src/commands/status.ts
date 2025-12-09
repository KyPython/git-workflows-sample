import { execSync } from 'child_process';
import chalk from 'chalk';

export interface WorkflowStatus {
  readyForPR: boolean;
  issues: string[];
  warnings: string[];
  info: string[];
}

/**
 * Checks if current branch is ready for Pull Request
 */
export function checkPRReadiness(): WorkflowStatus {
  const status: WorkflowStatus = {
    readyForPR: true,
    issues: [],
    warnings: [],
    info: []
  };

  try {
    execSync('git rev-parse --git-dir', { stdio: 'ignore' });
  } catch {
    status.readyForPR = false;
    status.issues.push('Not in a Git repository');
    return status;
  }

  try {
    // Check current branch
    const currentBranch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf-8' }).trim();
    status.info.push(`Current branch: ${currentBranch}`);

    // Check if on main or develop
    if (currentBranch === 'main' || currentBranch === 'develop') {
      status.warnings.push(`You're on ${currentBranch}. Consider creating a feature branch first.`);
    }

    // Check for uncommitted changes
    const statusOutput = execSync('git status --porcelain', { encoding: 'utf-8' });
    if (statusOutput.trim().length > 0) {
      status.issues.push('You have uncommitted changes. Commit or stash them before creating a PR.');
      status.readyForPR = false;
    }

    // Check if branch is up to date with remote
    try {
      const tracking = execSync('git rev-parse --abbrev-ref --symbolic-full-name @{u}', { encoding: 'utf-8' }).trim();
      execSync(`git fetch origin ${currentBranch}`, { stdio: 'ignore' });
      
      const localCommit = execSync('git rev-parse HEAD', { encoding: 'utf-8' }).trim();
      const remoteCommit = execSync(`git rev-parse ${tracking}`, { encoding: 'utf-8' }).trim();
      
      if (localCommit !== remoteCommit) {
        status.info.push('Branch differs from remote. Make sure to push your changes.');
      }
    } catch {
      status.warnings.push('No remote tracking branch. Use: git push -u origin <branch>');
    }

    // Check commit messages
    try {
      const commits = execSync(`git log origin/develop..HEAD --oneline --no-merges`, { encoding: 'utf-8' });
      if (commits.trim().length === 0) {
        status.warnings.push('No commits ahead of develop. Make sure you have commits to merge.');
      } else {
        const commitCount = commits.trim().split('\n').length;
        status.info.push(`${commitCount} commit(s) ahead of develop`);
        
        // Check if commits follow conventional commits (basic check)
        const invalidCommits = commits.split('\n').filter(line => {
          const match = line.match(/^[a-f0-9]+\s+(\w+)(\([^)]+\))?:\s+/);
          return !match;
        });
        
        if (invalidCommits.length > 0) {
          status.warnings.push('Some commits may not follow Conventional Commits format. Consider: git-workflow commit check');
        }
      }
    } catch {
      // develop might not exist, check against main
      try {
        const commits = execSync(`git log origin/main..HEAD --oneline --no-merges`, { encoding: 'utf-8' });
        if (commits.trim().length > 0) {
          const commitCount = commits.trim().split('\n').length;
          status.info.push(`${commitCount} commit(s) ahead of main`);
        }
      } catch {
        status.warnings.push('Could not determine commits ahead of base branch');
      }
    }

    // Check if branch needs rebase
    try {
      execSync('git fetch origin develop', { stdio: 'ignore' });
      const mergeBase = execSync('git merge-base HEAD origin/develop', { encoding: 'utf-8' }).trim();
      const developHead = execSync('git rev-parse origin/develop', { encoding: 'utf-8' }).trim();
      
      if (mergeBase !== developHead) {
        status.warnings.push('Branch is behind develop. Consider rebasing: git rebase origin/develop');
      }
    } catch {
      // develop might not exist
    }

  } catch (error: any) {
    status.issues.push(`Error checking status: ${error.message}`);
    status.readyForPR = false;
  }

  if (status.issues.length > 0) {
    status.readyForPR = false;
  }

  return status;
}

/**
 * Displays workflow status
 */
export function showWorkflowStatus(): void {
  const status = checkPRReadiness();

  console.log(chalk.blue.bold('\n📊 Git Workflow Status\n'));

  // Display info
  if (status.info.length > 0) {
    status.info.forEach(msg => {
      console.log(chalk.blue('ℹ️ '), msg);
    });
    console.log('');
  }

  // Display issues
  if (status.issues.length > 0) {
    status.issues.forEach(issue => {
      console.log(chalk.red('❌'), issue);
    });
    console.log('');
  }

  // Display warnings
  if (status.warnings.length > 0) {
    status.warnings.forEach(warning => {
      console.log(chalk.yellow('⚠️ '), warning);
    });
    console.log('');
  }

  // Final verdict
  if (status.readyForPR) {
    console.log(chalk.green.bold('✅ Branch is ready for Pull Request!'));
    console.log(chalk.gray('\nNext steps:'));
    console.log(chalk.gray('  1. Push your branch: git push origin <branch>'));
    console.log(chalk.gray('  2. Create a Pull Request on GitHub/GitLab'));
  } else {
    console.log(chalk.red.bold('❌ Branch is NOT ready for Pull Request'));
    console.log(chalk.gray('\nPlease address the issues above before creating a PR.'));
  }
}

