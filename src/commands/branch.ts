import { execSync } from 'child_process';
import chalk from 'chalk';

export interface BranchOptions {
  name: string;
  from?: string;
}

/**
 * Validates branch naming convention
 * Supports: feature/*, bugfix/*, hotfix/*, release/*
 */
export function validateBranchName(name: string): { valid: boolean; error?: string } {
  const patterns = [
    /^feature\/[a-z0-9-]+$/,
    /^bugfix\/[a-z0-9-]+$/,
    /^hotfix\/[a-z0-9-]+$/,
    /^release\/[a-z0-9-]+$/,
    /^main$/,
    /^develop$/
  ];

  const isValid = patterns.some(pattern => pattern.test(name));

  if (!isValid) {
    return {
      valid: false,
      error: `Branch name "${name}" does not follow convention.\n` +
        `Valid formats: feature/name, bugfix/name, hotfix/name, release/name`
    };
  }

  return { valid: true };
}

/**
 * Creates a new feature branch from develop (or specified branch)
 */
export function createBranch(options: BranchOptions): void {
  const { name, from = 'develop' } = options;

  // Validate branch name
  const validation = validateBranchName(name);
  if (!validation.valid) {
    console.error(chalk.red('❌ Error:'), validation.error);
    process.exit(1);
  }

  try {
    // Check if we're in a git repository
    execSync('git rev-parse --git-dir', { stdio: 'ignore' });
  } catch {
    console.error(chalk.red('❌ Error:'), 'Not in a Git repository');
    process.exit(1);
  }

  try {
    // Check if branch already exists
    const branches = execSync('git branch --list', { encoding: 'utf-8' });
    const remoteBranches = execSync('git branch -r --list', { encoding: 'utf-8' });
    
    if (branches.includes(name) || remoteBranches.includes(`origin/${name}`)) {
      console.error(chalk.red('❌ Error:'), `Branch "${name}" already exists`);
      process.exit(1);
    }

    // Fetch latest changes
    console.log(chalk.blue('📥 Fetching latest changes...'));
    execSync('git fetch origin', { stdio: 'inherit' });

    // Checkout base branch and update it
    console.log(chalk.blue(`📂 Switching to ${from}...`));
    try {
      execSync(`git checkout ${from}`, { stdio: 'inherit' });
      execSync(`git pull origin ${from}`, { stdio: 'inherit' });
    } catch {
      console.warn(chalk.yellow(`⚠️  Warning: Could not checkout ${from}, creating from current branch`));
    }

    // Create and checkout new branch
    console.log(chalk.blue(`🌿 Creating branch: ${name}...`));
    execSync(`git switch -c ${name}`, { stdio: 'inherit' });

    console.log(chalk.green(`✅ Successfully created and switched to branch: ${name}`));
    console.log(chalk.gray(`\nNext steps:`));
    console.log(chalk.gray(`  1. Make your changes`));
    console.log(chalk.gray(`  2. Commit: git commit -m "feat: your message"`));
    console.log(chalk.gray(`  3. Push: git push -u origin ${name}`));
    console.log(chalk.gray(`  4. Create a Pull Request`));

  } catch (error: any) {
    console.error(chalk.red('❌ Error creating branch:'), error.message);
    process.exit(1);
  }
}

/**
 * Lists current branch and branch status
 */
export function showBranchStatus(): void {
  try {
    const currentBranch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf-8' }).trim();
    const validation = validateBranchName(currentBranch);

    console.log(chalk.blue('📍 Current Branch:'), chalk.bold(currentBranch));
    
    if (!validation.valid && !['main', 'develop'].includes(currentBranch)) {
      console.log(chalk.yellow('⚠️  Warning:'), validation.error);
    } else {
      console.log(chalk.green('✅ Branch name follows convention'));
    }

    // Show ahead/behind status
    try {
      const tracking = execSync('git rev-parse --abbrev-ref --symbolic-full-name @{u}', { encoding: 'utf-8' }).trim();
      const ahead = execSync(`git rev-list --count ${tracking}..HEAD`, { encoding: 'utf-8' }).trim();
      const behind = execSync(`git rev-list --count HEAD..${tracking}`, { encoding: 'utf-8' }).trim();

      if (ahead !== '0') {
        console.log(chalk.yellow(`📤 ${ahead} commit(s) ahead of ${tracking}`));
      }
      if (behind !== '0') {
        console.log(chalk.yellow(`📥 ${behind} commit(s) behind ${tracking}`));
      }
      if (ahead === '0' && behind === '0') {
        console.log(chalk.green('✅ Branch is up to date'));
      }
    } catch {
      // No tracking branch
      console.log(chalk.gray('ℹ️  No remote tracking branch set'));
    }

  } catch (error: any) {
    console.error(chalk.red('❌ Error:'), 'Not in a Git repository');
    process.exit(1);
  }
}

