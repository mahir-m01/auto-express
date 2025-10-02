const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h') || (args.includes('--h'))) {
  console.log(`
Usage: auto <command> [options]

Commands:
  init                Start an interactive CLI to create a new project.
  new <project-name>  Quickly create a new Express API project.

Options:
  -h, --help          Display this help message.
`);
  process.exit(0);
}

export function sayHello(){
    console.log("HEllo");
    
}