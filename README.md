# Git Workflow Helper

A powerful CLI tool to help developers follow Git workflow best practices and maintain consistent branching strategies.

🌐 **Repository**: [https://github.com/KyPython/git-workflows-sample](https://github.com/KyPython/git-workflows-sample)

## Overview

`git-workflow-helper` (alias: `gwf`) is a command-line tool that automates and validates common Git workflow tasks:

- ✅ **Branch Management** - Create and validate feature branches with proper naming conventions
- ✅ **Commit Validation** - Ensure commit messages follow Conventional Commits specification
- ✅ **PR Readiness Check** - Verify if your branch is ready for Pull Request
- ✅ **Rebase Assistance** - Safely rebase branches with helpful guidance

## Installation

### From Source

```bash
# Clone the repository
git clone https://github.com/KyPython/git-workflows-sample.git
cd git-workflows-sample

# Install dependencies
npm install

# Build the project
npm run build

# Install globally (optional)
npm link
```

### Usage

Once installed, you can use either `git-workflow` or the shorter alias `gwf`:

```bash
git-workflow --help
# or
gwf --help
```

### NPM Scripts Integration

You can also use npm scripts for convenience. Add these to your project's `package.json`:

```json
{
  "scripts": {
    "git:status": "git-workflow status",
    "git:branch:create": "git-workflow branch:create",
    "git:branch:status": "git-workflow branch:status",
    "git:commit:check": "git-workflow commit:check",
    "git:sync": "git-workflow sync",
    "git:pr": "git-workflow pr",
    "git:rebase": "git-workflow rebase",
    "git:template": "git-workflow template"
  }
}
```

**Quick Setup:**
Copy the scripts from [examples/package.json.scripts.example.json](./examples/package.json.scripts.example.json) to your `package.json`.

Then use them with:
```bash
npm run git:status
npm run git:pr
npm run git:sync
```

### CI/CD Integration

**GitHub Actions Example:**
See [.github/workflows/example.yml](./.github/workflows/example.yml) for a complete workflow example that demonstrates:
- Testing git workflow commands in CI
- Integration testing on pull requests
- PR readiness checks

## Commands

### Branch Management

#### Create a Feature Branch

Create a new feature branch from `develop` (or specified branch) with automatic validation:

```bash
git-workflow branch:create feature/add-logging
# or
gwf bc feature/add-logging

# Create from a different base branch
gwf bc feature/fix-bug --from main
```

**Supported branch types:**
- `feature/*` - New features
- `bugfix/*` - Bug fixes
- `hotfix/*` - Critical production fixes
- `release/*` - Release preparation

#### Check Branch Status

View current branch status and validation:

```bash
git-workflow branch:status
# or
gwf bs
```

#### Validate Branch Name

Validate a branch name against conventions:

```bash
git-workflow branch:validate feature/my-feature
# or
gwf bv feature/my-feature
```

### Commit Validation

#### Check Last Commit

Validate the last commit message:

```bash
git-workflow commit:check
# or
gwf cc
```

#### Validate Commit Message

Validate a commit message before committing:

```bash
git-workflow commit:validate "feat(auth): add login functionality"
# or
gwf cv "feat(auth): add login functionality"
```

**Commit Message Format:**
```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

**Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `perf`, `ci`, `build`, `revert`

### Workflow Status

Check if your branch is ready for Pull Request:

```bash
git-workflow status
# or
gwf st
```

This command checks:
- ✅ Uncommitted changes
- ✅ Branch naming convention
- ✅ Commit message format
- ✅ Branch sync status
- ✅ Commits ahead/behind base branch

### Rebase Helper

Safely rebase your branch onto `develop` (or specified branch):

```bash
git-workflow rebase
# or
gwf rb

# Rebase onto a different branch
gwf rb --base main

# Interactive rebase
gwf rb --interactive
```

## Examples

### Complete Feature Workflow

```bash
# 1. Create a feature branch (auto-detects base branch)
gwf bc feature/add-user-authentication
# or with npm: npm run git:branch:create -- feature/add-user-authentication

# 2. Make your changes and commit
git add .
git commit -m "feat(auth): add user authentication"

# 3. Validate your commit
gwf cc
# or: npm run git:commit:check

# 4. Sync with remote (fetch and rebase)
gwf sync
# or: npm run git:sync

# 5. Check if ready for PR (comprehensive check)
gwf pr
# or: npm run git:pr

# 6. Push and create PR
git push origin feature/add-user-authentication
```

### Validate Before Committing

```bash
# Check your commit message before committing
gwf cv "feat(api): implement user endpoint"

# If valid, proceed with commit
git commit -m "feat(api): implement user endpoint"
```

## Project Structure

```
.
├── src/
│   ├── index.ts              # CLI entry point
│   └── commands/
│       ├── branch.ts         # Branch management commands
│       ├── commit.ts         # Commit validation
│       ├── status.ts         # PR readiness checker
│       └── rebase.ts         # Rebase helper
├── dist/                     # Compiled JavaScript (gitignored)
├── package.json
├── tsconfig.json
├── README.md
└── GIT_WORKFLOW.md           # Detailed Git workflow documentation
```

## Features

### 🎯 Branch Management
- **Auto-detection** of base branch (main/master/develop)
- Automatic branch creation with validation
- Ensures proper naming conventions
- Fetches latest changes before branching
- Visual feedback with colored output

### 📝 Commit Validation
- Validates against Conventional Commits spec
- Checks commit message format
- Validates commit type and scope
- Suggests improvements

### ✅ PR Readiness
- Comprehensive checks before creating PR
- Identifies missing commits
- Checks branch sync status
- Validates commit messages

### 🔄 Rebase & Sync
- **Sync command**: Fetch and rebase in one step
- Auto-detects integration branch
- Checks for uncommitted changes
- Validates base branch exists
- Provides conflict resolution guidance
- Safe force-push warnings

### 📋 PR Preparation
- **Comprehensive PR check**: Runs all validations at once
- Validates branch status, commits, and PR readiness
- Provides actionable feedback
- Single command before creating PR

## CI/CD Integration

The tool works seamlessly in CI environments. For GitHub Actions:

```yaml
- name: Check PR readiness
  run: |
    npm install
    npm run build
    npm run git:pr || echo "⚠️ PR checks failed (continuing)"
```

The tool:
- ✅ Works without interactive prompts
- ✅ Fails gracefully (use `|| true` for optional checks)
- ✅ Provides clear exit codes for CI
- ✅ Supports `CI=true` environment variable pattern

## Development

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Git

### Building

```bash
npm install
npm run build
```

### Running Locally

```bash
# Development mode (with ts-node)
npm run dev -- branch:status

# Production mode
npm run build
node dist/index.js branch:status
```

## Learn More

See [GIT_WORKFLOW.md](./GIT_WORKFLOW.md) for comprehensive documentation on:
- Branching strategies
- Git commands and workflows
- Pull Request process
- How this demonstrates "Source Code Control" principles from *The Pragmatic Programmer*

## Contributing

Contributions are welcome! Please follow the Git workflow documented in `GIT_WORKFLOW.md`.

## License

MIT

