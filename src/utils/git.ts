import { execSync } from 'child_process';

/**
 * Auto-detects the default base branch (main, master, or develop)
 */
export function detectDefaultBranch(): string {
  try {
    // Try to get the default branch from remote
    const symbolicRef = execSync('git symbolic-ref refs/remotes/origin/HEAD 2>/dev/null', { 
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'ignore']
    }).trim();
    
    if (symbolicRef) {
      const branch = symbolicRef.replace('refs/remotes/origin/', '');
      return branch;
    }
  } catch {
    // Fall through to other detection methods
  }

  // Try to detect by checking which branches exist
  try {
    execSync('git fetch origin --quiet', { stdio: 'ignore' });
    
    const branches = execSync('git branch -r', { encoding: 'utf-8' });
    
    // Check in order of preference
    if (branches.includes('origin/main')) {
      return 'main';
    }
    if (branches.includes('origin/master')) {
      return 'master';
    }
    if (branches.includes('origin/develop')) {
      return 'develop';
    }
  } catch {
    // Continue to default
  }

  // Default fallback
  return 'main';
}

/**
 * Gets the integration branch (develop if exists, otherwise default branch)
 */
export function getIntegrationBranch(): string {
  try {
    execSync('git fetch origin --quiet', { stdio: 'ignore' });
    const branches = execSync('git branch -r', { encoding: 'utf-8' });
    
    if (branches.includes('origin/develop')) {
      return 'develop';
    }
    
    return detectDefaultBranch();
  } catch {
    return detectDefaultBranch();
  }
}

/**
 * Checks if a branch exists locally or remotely
 */
export function branchExists(branchName: string): { local: boolean; remote: boolean } {
  try {
    const localBranches = execSync('git branch --list', { encoding: 'utf-8' });
    const remoteBranches = execSync('git branch -r --list', { encoding: 'utf-8' });
    
    return {
      local: localBranches.includes(branchName),
      remote: remoteBranches.includes(`origin/${branchName}`)
    };
  } catch {
    return { local: false, remote: false };
  }
}

/**
 * Checks if we're in a git repository
 */
export function isGitRepository(): boolean {
  try {
    execSync('git rev-parse --git-dir', { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

/**
 * Gets the current branch name
 */
export function getCurrentBranch(): string | null {
  try {
    return execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf-8' }).trim();
  } catch {
    return null;
  }
}

/**
 * Checks if there are uncommitted changes
 */
export function hasUncommittedChanges(): boolean {
  try {
    const status = execSync('git status --porcelain', { encoding: 'utf-8' });
    return status.trim().length > 0;
  } catch {
    return false;
  }
}

