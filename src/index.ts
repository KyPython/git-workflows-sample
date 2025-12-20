#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { createBranch, showBranchStatus, validateBranchName } from './commands/branch';
import { validateCommitMessage, validateLastCommit, validateStagedCommit } from './commands/commit';
import { showWorkflowStatus } from './commands/status';
import { rebaseBranch } from './commands/rebase';
import { syncBranch } from './commands/sync';
import { preparePR } from './commands/pr';
import { showCommitTemplate } from './commands/template';

const program = new Command();

program
  .name('git-workflow')
  .description('A CLI tool to help developers follow Git workflow best practices')
  .version('1.0.0');

// Branch commands
program
  .command('branch:create')
  .alias('bc')
  .description('Create a new feature branch from develop (or specified branch)')
  .argument('<name>', 'Branch name (e.g., feature/add-logging)')
  .option('-f, --from <branch>', 'Base branch to create from', 'develop')
  .action((name: string, options: { from?: string }) => {
    createBranch({ name, from: options.from });
  });

program
  .command('branch:status')
  .alias('bs')
  .description('Show current branch status and validation')
  .action(() => {
    showBranchStatus();
  });

program
  .command('branch:validate')
  .alias('bv')
  .description('Validate a branch name')
  .argument('<name>', 'Branch name to validate')
  .action((name: string) => {
    const validation = validateBranchName(name);
    if (validation.valid) {
      console.log(chalk.green(`✅ Branch name "${name}" is valid`));
    } else {
      console.error(chalk.red(`❌ ${validation.error}`));
      process.exit(1);
    }
  });

// Commit commands
program
  .command('commit:check')
  .alias('cc')
  .description('Validate the last commit message')
  .action(() => {
    validateLastCommit();
  });

program
  .command('commit:validate')
  .alias('cv')
  .description('Validate a commit message')
  .argument('<message>', 'Commit message to validate')
  .action((message: string) => {
    validateStagedCommit(message);
  });

// Status commands
program
  .command('status')
  .alias('st')
  .description('Check if current branch is ready for Pull Request')
  .action(() => {
    showWorkflowStatus();
  });

// Rebase commands
program
  .command('rebase')
  .alias('rb')
  .description('Rebase current branch onto develop (or specified branch)')
  .option('-b, --base <branch>', 'Base branch to rebase onto (auto-detected if not specified)')
  .option('-i, --interactive', 'Interactive rebase', false)
  .action((options: { base?: string; interactive?: boolean }) => {
    rebaseBranch(options);
  });

// Sync commands
program
  .command('sync')
  .alias('sy')
  .description('Sync current branch - fetch and rebase onto integration branch')
  .option('-b, --base <branch>', 'Base branch to sync with (auto-detected if not specified)')
  .option('--no-rebase', 'Skip rebase, only fetch and pull', false)
  .action((options: { base?: string; rebase?: boolean }) => {
    syncBranch(options);
  });

// PR commands
program
  .command('pr')
  .description('Run comprehensive checks to prepare for Pull Request')
  .action(() => {
    preparePR();
  });

// Template commands
program
  .command('template')
  .alias('tpl')
  .description('Show commit message template')
  .action(() => {
    showCommitTemplate();
  });

// Help command enhancement
program.on('--help', () => {
  console.log('');
  console.log(chalk.gray('Examples:'));
  console.log(chalk.gray('  $ git-workflow branch:create feature/add-logging'));
  console.log(chalk.gray('  $ git-workflow sync'));
  console.log(chalk.gray('  $ git-workflow pr'));
  console.log(chalk.gray('  $ git-workflow commit:check'));
  console.log(chalk.gray('  $ git-workflow template'));
  console.log('');
  console.log(chalk.gray('For more information, see GIT_WORKFLOW.md'));
});

// Parse arguments
program.parse(process.argv);

// Show help if no command provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
