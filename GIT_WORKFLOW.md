# Git Workflow Documentation

This document describes the Git branching model and workflow strategies used in this project. This workflow is based on industry best practices and aligns with the principles outlined in *The Pragmatic Programmer*.

## Branching Model

Our project uses a **Git Flow**-inspired branching model with three main branch types:

### 1. `main` Branch (Production/Stable)

- **Purpose**: Contains only production-ready, stable code
- **Protection**: Should be protected against direct pushes
- **Updates**: Only updated via:
  - Merge from `develop` after thorough testing
  - Hotfix branches for critical production issues
- **Tagging**: Each release should be tagged (e.g., `v1.0.0`, `v1.1.0`)

### 2. `develop` Branch (Integration)

- **Purpose**: Integration branch where completed features are merged
- **Status**: Should always be in a deployable state
- **Updates**: Receives merges from feature branches via Pull Requests
- **Deployment**: Can be deployed to staging environments

### 3. `feature/*` Branches

- **Purpose**: Development branches for new features or enhancements
- **Naming**: Use descriptive names like `feature/add-logging`, `feature/user-authentication`
- **Lifetime**: Created from `develop`, merged back into `develop` when complete
- **Updates**: Regularly rebased or merged from `develop` to stay current

## Workflow Example

Here's a step-by-step example of developing a new feature:

### Step 1: Start from develop

```bash
# Ensure you're on develop and it's up to date
git checkout develop
git pull origin develop

# Verify you're on the latest version
git status
```

### Step 2: Create a feature branch

```bash
# Create and switch to a new feature branch
git switch -c feature/add-logging

# Or using the older syntax:
git checkout -b feature/add-logging

# Verify you're on the new branch
git branch
```

### Step 3: Develop your feature

```bash
# Make your changes (edit files, add new code, etc.)
# For example, we created src/utils/logger.ts

# Stage your changes
git add src/utils/logger.ts

# Commit with a clear message
git commit -m "feat: add logging utility with multiple log levels"

# Continue making commits as needed
git add src/index.ts
git commit -m "refactor: integrate logger into main application"
```

### Step 4: Keep your branch updated

While working on your feature, `develop` may have moved forward. Keep your branch current:

**Option A: Rebase (preferred for cleaner history)**

```bash
# Fetch latest changes
git fetch origin

# Rebase your feature branch onto latest develop
git rebase origin/develop

# If conflicts occur, resolve them and continue
git add <resolved-files>
git rebase --continue

# If you want to abort the rebase
git rebase --abort
```

**Option B: Merge develop into your feature branch**

```bash
git checkout develop
git pull origin develop
git checkout feature/add-logging
git merge develop

# Resolve conflicts if any, then commit
git add <resolved-files>
git commit -m "merge: integrate latest changes from develop"
```

### Step 5: Push your feature branch

```bash
# Push your feature branch to remote
git push origin feature/add-logging

# If you've rebased and need to force push (use with caution!)
# Only do this if you're the only one working on the branch
git push --force-with-lease origin feature/add-logging
```

### Step 6: Create a Pull Request

1. Go to your Git hosting platform (GitHub, GitLab, Bitbucket, etc.)
2. Create a Pull Request from `feature/add-logging` to `develop`
3. Include:
   - Clear title describing the feature
   - Description of what changed and why
   - Link to related issues
   - Screenshots if applicable

### Step 7: Code Review Process

- Team members review your code
- Address review comments by pushing additional commits
- Once approved, the PR is merged into `develop`
- The feature branch can be deleted after merging

### Step 8: Merge back to develop

```bash
# After PR is approved and merged, clean up locally
git checkout develop
git pull origin develop

# Delete the feature branch (locally and remotely if not auto-deleted)
git branch -d feature/add-logging
git push origin --delete feature/add-logging
```

## Common Git Commands

### Branch Management

```bash
# List all branches
git branch -a

# Switch branches
git switch <branch-name>
# or
git checkout <branch-name>

# Create and switch to new branch
git switch -c <branch-name>
# or
git checkout -b <branch-name>

# Delete a branch
git branch -d <branch-name>          # Safe delete (only if merged)
git branch -D <branch-name>          # Force delete
```

### Viewing History

```bash
# View commit history
git log --oneline --graph --all

# View changes in a branch
git log develop..feature/add-logging

# View what files changed
git diff develop..feature/add-logging
```

### Rebasing

```bash
# Rebase current branch onto another branch
git rebase <base-branch>

# Interactive rebase (to squash, reword, or reorder commits)
git rebase -i HEAD~3  # Rebase last 3 commits

# During rebase:
git rebase --continue  # Continue after resolving conflicts
git rebase --skip      # Skip current commit
git rebase --abort     # Abort the rebase
```

### Merging

```bash
# Merge another branch into current branch
git merge <branch-name>

# Merge with a specific strategy
git merge --no-ff <branch-name>  # Always create merge commit
git merge --ff-only <branch-name>  # Only fast-forward merge
```

### Stashing

```bash
# Temporarily save uncommitted changes
git stash

# List stashes
git stash list

# Apply most recent stash
git stash pop

# Apply a specific stash
git stash apply stash@{0}

# Drop a stash
git stash drop stash@{0}
```

## Commit Message Guidelines

Follow conventional commit format for better history:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, semicolons, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```bash
git commit -m "feat(logger): add debug log level support"
git commit -m "fix(index): correct main function export"
git commit -m "docs: update workflow documentation"
```

## Example Git History

Here's what a typical Git history might look like:

```
*   a1b2c3d (HEAD -> develop) Merge pull request #2: Add logging feature
|\
| * f4e5d6c (feature/add-logging) refactor: integrate logger into main app
| * e7f8g9h feat: add logging utility with multiple log levels
|/
*   h0i1j2k Merge pull request #1: Initialize project structure
|\
| * k3l4m5n docs: add README and workflow documentation
| * m6n7o8p feat: create hello world application
|/
* p9q0r1s (main) Initial commit
```

## Hotfix Workflow

For critical production issues:

```bash
# Create hotfix branch from main
git checkout main
git pull origin main
git switch -c hotfix/critical-bug-fix

# Make the fix and commit
git add <fixed-files>
git commit -m "fix: critical production bug"

# Merge back to both main and develop
git checkout main
git merge hotfix/critical-bug-fix
git tag v1.0.1  # Tag the release

git checkout develop
git merge hotfix/critical-bug-fix

# Clean up
git branch -d hotfix/critical-bug-fix
```

## Source Code Control: The Pragmatic Programmer Connection

This workflow demonstrates several key principles from *The Pragmatic Programmer*:

### 1. **Use Source Code Control**

> "Always use source code control (SCC). Always. Even if you are a single-person team on a one-week project."

This workflow ensures that:
- Every change is tracked in Git
- Multiple developers can work simultaneously
- Changes can be reviewed before integration
- History is preserved for debugging and auditing

### 2. **Don't Repeat Yourself (DRY)**

The branching model prevents duplication:
- Shared code lives in `develop` and `main`
- Feature branches prevent conflicting changes
- Merge conflicts are resolved systematically

### 3. **Orthogonality**

The branching model provides:
- **Independent features**: Work can proceed in parallel on different features
- **Isolated changes**: Features don't interfere with each other until integration
- **Separate concerns**: Production (`main`), integration (`develop`), and development (`feature/*`) are separated

### 4. **Design by Contract**

Pull Requests act as contracts:
- Clear descriptions of what will change
- Code review ensures quality standards
- Tests validate the contract

### 5. **Refactor Early, Refactor Often**

The workflow supports refactoring:
- Small, focused branches make refactoring safer
- Regular integration catches issues early
- Clean history helps identify when regressions were introduced

### 6. **Pragmatic Teams**

The workflow enables:
- **Knowledge sharing**: PRs spread knowledge across the team
- **Code ownership**: Multiple eyes on code prevent defects
- **Communication**: PR discussions document decisions
- **Responsibility**: Clear process ensures accountability

### 7. **Testing**

While not explicitly shown in this sample, the workflow supports:
- Feature branches enable isolated testing
- Integration testing on `develop`
- Production validation on `main`

## Best Practices

1. **Keep branches focused**: One feature per branch
2. **Commit often**: Small, logical commits are easier to review and revert
3. **Write clear commit messages**: Future you will thank present you
4. **Pull before push**: Always ensure your local branch is current
5. **Use Pull Requests**: Never merge directly to `develop` or `main`
6. **Review your own PR**: Read through changes before requesting review
7. **Keep feature branches short-lived**: Merge within days, not weeks
8. **Test before merging**: Ensure your code works before creating a PR
9. **Delete merged branches**: Keep the repository clean
10. **Use meaningful branch names**: `feature/add-logging` is better than `feature1`

## Troubleshooting

### Accidentally committed to wrong branch

```bash
# Move last commit to a new branch
git branch feature/correct-branch
git reset --hard HEAD~1
git checkout feature/correct-branch
```

### Need to undo last commit (keep changes)

```bash
git reset --soft HEAD~1
```

### Need to undo last commit (discard changes)

```bash
git reset --hard HEAD~1
```

### Accidentally pushed to wrong branch

```bash
# Revert the commit
git revert HEAD
git push origin <branch-name>

# Or if it's the only commit, reset and force push (dangerous!)
# Only if you're certain no one else has pulled
git reset --hard HEAD~1
git push --force-with-lease origin <branch-name>
```

## Resources

- [Pro Git Book](https://git-scm.com/book)
- [GitHub Flow](https://guides.github.com/introduction/flow/)
- [Git Flow](https://nvie.com/posts/a-successful-git-branching-model/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- *The Pragmatic Programmer* by Andrew Hunt and David Thomas

---

**Remember**: The best workflow is the one your team understands and consistently follows. This is a starting point—adapt it to your team's needs!

