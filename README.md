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
# 1. Create a feature branch
gwf bc feature/add-user-authentication

# 2. Make your changes and commit
git add .
git commit -m "feat(auth): add user authentication"

# 3. Validate your commit
gwf cc

# 4. Check if ready for PR
gwf st

# 5. If branch is behind, rebase
gwf rb

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

### 🔄 Rebase Safety
- Checks for uncommitted changes
- Validates base branch exists
- Provides conflict resolution guidance
- Safe force-push warnings

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

