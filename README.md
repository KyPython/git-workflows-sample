# Git Workflows Sample Project

A sample Node.js + TypeScript application designed to demonstrate solid Git workflows and branching strategies.

🌐 **Repository**: [https://github.com/KyPython/git-workflows-sample](https://github.com/KyPython/git-workflows-sample)

## Overview

This project serves as a practical example of how to structure your Git workflow using a branching model that includes:

- **main** - Stable, production-ready code
- **develop** - Integration branch for features
- **feature/\*** - Feature branches for new development
- Pull Request workflow and code review process

## Project Structure

```
.
├── src/
│   ├── index.ts          # Main application entry point
│   └── utils/
│       └── logger.ts     # Logging utility (example feature)
├── dist/                 # Compiled JavaScript (gitignored)
├── package.json
├── tsconfig.json
├── README.md
└── GIT_WORKFLOW.md       # Detailed Git workflow documentation
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Git

### Installation

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run the compiled code
npm start

# Or run with TypeScript directly (development)
npm run dev
```

## Features

1. **Hello World** - Basic application entry point
2. **Logging Utility** - A simple logger with different log levels (demonstrates feature branch workflow)

## Learn More

See [GIT_WORKFLOW.md](./GIT_WORKFLOW.md) for comprehensive documentation on:
- Branching strategies
- Git commands and workflows
- Pull Request process
- How this demonstrates "Source Code Control" principles from *The Pragmatic Programmer*

## License

MIT

