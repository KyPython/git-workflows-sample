import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import chalk from 'chalk';

/**
 * Shows commit message template
 */
export function showCommitTemplate(): void {
  try {
    // Try multiple possible paths (for both dev and compiled code)
    const possiblePaths = [
      join(__dirname, '../../commit-template.txt'),  // From compiled dist/
      join(__dirname, '../../../commit-template.txt'), // Alternative
      join(process.cwd(), 'commit-template.txt'),    // From project root
      join(dirname(__dirname), '../../commit-template.txt') // More reliable path
    ];
    
    let templatePath = possiblePaths.find(path => existsSync(path));
    
    if (!templatePath) {
      // Fallback: show template inline
      const template = `# <type>(<scope>): <subject>
#
# <body>
#
# <footer>

# Types:
#   feat:     A new feature
#   fix:      A bug fix
#   docs:     Documentation only changes
#   style:    Changes that do not affect the meaning of the code
#   refactor: A code change that neither fixes a bug nor adds a feature
#   perf:     A code change that improves performance
#   test:     Adding missing tests or correcting existing tests
#   chore:    Changes to the build process or auxiliary tools
#   ci:       Changes to CI configuration files and scripts
#   build:    Changes that affect the build system or external dependencies
#   revert:   Reverts a previous commit
#
# Scope: optional, can be anything specifying the scope of the commit
# Subject: short summary (50 chars or less, imperative mood)
# Body: optional, longer explanation (wrap at 72 chars)
# Footer: optional, for breaking changes or issue references
#
# Examples:
#   feat(auth): add user login functionality
#   fix(api): correct user endpoint response format
#   docs: update README with installation instructions
#   refactor(utils): simplify date formatting logic`;
      
      console.log(chalk.blue('📝 Commit Message Template\n'));
      console.log(chalk.gray(template));
      console.log(chalk.gray('\n💡 Tip: Use this template to ensure your commits follow Conventional Commits format.'));
      return;
    }
    
    const template = readFileSync(templatePath, 'utf-8');
    
    console.log(chalk.blue('📝 Commit Message Template\n'));
    console.log(chalk.gray(template));
    console.log(chalk.gray('\n💡 Tip: Use this template to ensure your commits follow Conventional Commits format.'));
    console.log(chalk.gray('   You can copy this template and use it with: git commit -F template.txt'));
    
  } catch (error: any) {
    console.error(chalk.red('❌ Error:'), 'Could not load commit template');
    process.exit(1);
  }
}

