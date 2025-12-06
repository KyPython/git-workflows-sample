/**
 * Main application entry point
 * A simple hello world application
 */

function main(): void {
  console.log("Hello, World!");
  console.log("Welcome to the Git Workflows Sample Project");
}

if (require.main === module) {
  main();
}

export { main };

