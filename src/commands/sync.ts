import { execSync } from 'child_process';
import chalk from 'chalk';
import { getIntegrationBranch, getCurrentBranch, hasUncommittedChanges, isGitRepository } from '../utils/git';

export interface SyncOptions {
  base?: string;
  rebase?: boolean;
}

/**
 * Syncs current branch with remote - fetches and optionally rebases
 */
export function syncBranch(options: SyncOptions = {}): void {
  if (!isGitRepository()) {
    console.error(chalk.red('❌ Error:'), 'Not in a Git repository');
    process.exit(1);
  }

  const currentBranch = getCurrentBranch();
  if (!currentBranch) {
    console.error(chalk.red('❌ Error:'), 'Could not determine current branch');
    process.exit(1);
  }

  // Auto-detect base branch
  const detectedBranch = getIntegrationBranch();
  const baseBranch = options.base || detectedBranch;
  const shouldRebase = options.rebase ?? true;

  // Check for uncommitted changes
  if (hasUncommittedChanges()) {
    console.error(chalk.red('❌ Error:'), 'You have uncommitted changes. Commit or stash them first.');
    console.log(chalk.gray('   Stash: git stash'));
    console.log(chalk.gray('   Or commit: git commit -am "your message"'));
    process.exit(1);
  }

  try {
    console.log(chalk.blue('📥 Fetching latest changes from origin...'));
    execSync('git fetch origin', { stdio: 'inherit' });

    // Check if current branch has remote tracking
    try {
      const tracking = execSync(`git rev-parse --abbrev-ref --symbolic-full-name @{u}`, { 
        encoding: 'utf-8',
        stdio: ['pipe', 'pipe', 'ignore']
      }).trim();

      console.log(chalk.blue(`🔄 Updating ${currentBranch} from ${tracking}...`));
      execSync(`git pull --rebase origin ${currentBranch}`, { stdio: 'inherit' });
    } catch {
      console.log(chalk.yellow(`⚠️  No remote tracking branch set for ${currentBranch}`));
    }

    // Rebase onto base branch if requested
    if (shouldRebase && currentBranch !== baseBranch && !currentBranch.match(/^(main|master|develop)$/)) {
      try {
        execSync(`git rev-parse origin/${baseBranch}`, { stdio: 'ignore' });
        
        console.log(chalk.blue(`🔄 Rebasing ${currentBranch} onto origin/${baseBranch}...`));
        execSync(`git rebase origin/${baseBranch}`, { stdio: 'inherit' });
        
        console.log(chalk.green(`✅ Successfully synced and rebased ${currentBranch}`));
        console.log(chalk.gray('\nIf you need to push, you may need to force push:'));
        console.log(chalk.gray(`  git push --force-with-lease origin ${currentBranch}`));
        console.log(chalk.yellow('\n⚠️  Only force push if you\'re the only one working on this branch!'));
      } catch (error: any) {
        if (error.status === 1) {
          console.log(chalk.yellow('\n⚠️  Rebase encountered conflicts.'));
          console.log(chalk.gray('\nTo resolve conflicts:'));
          console.log(chalk.gray('  1. Fix conflicts in the files shown above'));
          console.log(chalk.gray('  2. Stage resolved files: git add <file>'));
          console.log(chalk.gray('  3. Continue rebase: git rebase --continue'));
          console.log(chalk.gray('\nTo abort: git rebase --abort'));
          process.exit(1);
        } else {
          console.warn(chalk.yellow(`⚠️  Could not rebase onto ${baseBranch} (branch may not exist)`));
        }
      }
    } else {
      console.log(chalk.green(`✅ Successfully synced ${currentBranch}`));
    }

  } catch (error: any) {
    console.error(chalk.red('❌ Error during sync:'), error.message);
    process.exit(1);
  }
}

