import { execSync } from 'child_process';
import chalk from 'chalk';

export interface CommitMessageValidation {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Validates commit message against Conventional Commits specification
 * Format: <type>(<scope>): <subject>
 */
export function validateCommitMessage(message: string): CommitMessageValidation {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!message || message.trim().length === 0) {
    errors.push('Commit message cannot be empty');
    return { valid: false, errors, warnings };
  }

  // Split message into first line (header) and body
  const lines = message.trim().split('\n');
  const header = lines[0];
  const body = lines.slice(1).join('\n');

  // Check header length
  if (header.length > 72) {
    warnings.push('Header should be 50 characters or less (currently ' + header.length + ')');
  }

  // Validate format: type(scope): subject
  const conventionalCommitPattern = /^(\w+)(\([^)]+\))?(!)?:\s+(.+)$/;
  const match = header.match(conventionalCommitPattern);

  if (!match) {
    errors.push(
      'Commit message does not follow Conventional Commits format.\n' +
      'Expected: <type>(<scope>): <subject>\n' +
      'Example: feat(auth): add login functionality'
    );
  } else {
    const [, type, scope, breaking, subject] = match;

    // Validate type
    const validTypes = [
      'feat', 'fix', 'docs', 'style', 'refactor',
      'test', 'chore', 'perf', 'ci', 'build', 'revert'
    ];

    if (!validTypes.includes(type)) {
      warnings.push(
        `Type "${type}" is not a standard conventional commit type.\n` +
        `Common types: ${validTypes.join(', ')}`
      );
    }

    // Validate subject
    if (subject.length === 0) {
      errors.push('Subject cannot be empty');
    } else if (subject.length > 50) {
      warnings.push('Subject should be concise (50 characters or less)');
    }

    // Check for imperative mood (not "added" but "add")
    const imperativePattern = /^(add|update|fix|remove|create|delete|implement|refactor|improve|change)/i;
    if (!imperativePattern.test(subject)) {
      warnings.push('Subject should use imperative mood (e.g., "add" not "added")');
    }
  }

  // Check body length
  if (body.length > 0 && body.length > 1000) {
    warnings.push('Body should be concise (1000 characters or less)');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Validates the last commit message
 */
export function validateLastCommit(): void {
  try {
    execSync('git rev-parse --git-dir', { stdio: 'ignore' });
  } catch {
    console.error(chalk.red('❌ Error:'), 'Not in a Git repository');
    process.exit(1);
  }

  try {
    const message = execSync('git log -1 --pretty=%B', { encoding: 'utf-8' });
    const validation = validateCommitMessage(message);

    console.log(chalk.blue('📝 Last Commit Message:'));
    console.log(chalk.gray(message.trim()));
    console.log('');

    if (validation.valid) {
      console.log(chalk.green('✅ Commit message is valid'));
      if (validation.warnings.length > 0) {
        console.log(chalk.yellow('\n⚠️  Warnings:'));
        validation.warnings.forEach(warning => {
          console.log(chalk.yellow(`   • ${warning}`));
        });
      }
    } else {
      console.log(chalk.red('❌ Commit message validation failed:'));
      validation.errors.forEach(error => {
        console.log(chalk.red(`   • ${error}`));
      });
      if (validation.warnings.length > 0) {
        console.log(chalk.yellow('\n⚠️  Warnings:'));
        validation.warnings.forEach(warning => {
          console.log(chalk.yellow(`   • ${warning}`));
        });
      }
      process.exit(1);
    }
  } catch (error: any) {
    console.error(chalk.red('❌ Error:'), 'Could not read last commit');
    process.exit(1);
  }
}

/**
 * Validates staged commit message
 */
export function validateStagedCommit(message: string): void {
  const validation = validateCommitMessage(message);

  if (validation.valid) {
    console.log(chalk.green('✅ Commit message is valid'));
    if (validation.warnings.length > 0) {
      console.log(chalk.yellow('\n⚠️  Warnings:'));
      validation.warnings.forEach(warning => {
        console.log(chalk.yellow(`   • ${warning}`));
      });
    }
  } else {
    console.log(chalk.red('❌ Commit message validation failed:'));
    validation.errors.forEach(error => {
      console.log(chalk.red(`   • ${error}`));
    });
    if (validation.warnings.length > 0) {
      console.log(chalk.yellow('\n⚠️  Warnings:'));
      validation.warnings.forEach(warning => {
        console.log(chalk.yellow(`   • ${warning}`));
      });
    }
    process.exit(1);
  }
}

