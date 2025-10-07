import { promises as fs } from 'fs';
import * as path from 'path';
import { Command } from 'commander';
import { PackageManager, ProjectType } from './type';
import {
  generateExpressProjectAPI,
  generateExpressProjectMVC,
  generateGitignoreContent,
  generateReadmeContent,
  promptProjectType,
  initializePackageManager,
} from './utils';
import { getVersion } from './helpers/version';

export function sayHello() {
  console.log('HEllo');
}

const program = new Command();

program
  .name('auto-express')
  .version(getVersion(), "-v, --version", "show version")
  .description('A CLI to generate Express.js projects')
  .option(
    '--pm <packageManager>',
    'specify package manager (npm, yarn, pnpm)',
    'npm',
  )
  .option('--type <type>', 'specify project type (api, mvc)')
  .option('--install', 'automatically install dependencies after project creation', false);

interface ProjectOptions {
  pm: PackageManager;
  type?: ProjectType;
  install?: boolean;
}

async function createProject(projectName: string, options: ProjectOptions) {
  console.log(`Creating a new Express project named: ${projectName}`);
  const projectPath = path.join(process.cwd(), projectName);
  const pm = options.pm || 'npm';
  const type = options.type ?? 'api';

  try {
    await fs.mkdir(projectPath, { recursive: true });
    console.log(`✅ Directory created at: ${projectPath}`);
  } catch (error) {
    console.error('❌ Error creating project directory:', error);
    process.exit(1);
  }

  try {
    await fs.writeFile(
      path.join(projectPath, '.gitignore'),
      generateGitignoreContent(),
    );
    console.log('✅ .gitignore file created.');
  } catch (error) {
    console.error('❌ Error creating .gitignore file:', error);
    process.exit(1);
  }

  try {
    await fs.writeFile(
      path.join(projectPath, 'README.md'),
      generateReadmeContent(projectName),
    );
    console.log('✅ README.md file created.');
  } catch (error) {
    console.error('❌ Error creating README.md file:', error);
    process.exit(1);
  }

  try {
    if (type === 'mvc') {
      await generateExpressProjectMVC(projectPath, pm);
    } else {
      await generateExpressProjectAPI(projectPath, pm);
    }
    console.log(`✅ ${type.toUpperCase()} scaffold generated.`);
  } catch (error) {
    console.error(`❌ Failed to generate ${type} scaffold:`, error);
    process.exit(1);
  }

  // Automatically install dependencies if --install flag is provided
  if (options.install) {
    try {
      await initializePackageManager(projectPath, pm);
    } catch (error) {
      console.warn('⚠️  Dependency installation failed, but project was created successfully.');
    }
  }

  console.log('\n✨ Project setup complete!');
  console.log(`Move into your new project: cd ${projectName}`);
  
  if (!options.install) {
    console.log('\nNext steps:');
    if (pm === 'yarn') {
      console.log('  yarn install');
      console.log('  yarn dev');
    } else if (pm === 'pnpm') {
      console.log('  pnpm install');
      console.log('  pnpm dev');
    } else {
      console.log('  npm install');
      console.log('  npm run dev');
    }
  } else {
    console.log('\nTo start development:');
    if (pm === 'yarn') {
      console.log('  yarn dev');
    } else if (pm === 'pnpm') {
      console.log('  pnpm dev');
    } else {
      console.log('  npm run dev');
    }
  }
}

program
  .argument('<project-name>', 'The name of the project to create')
  .action(async (projectName: string) => {
    const options = program.opts<ProjectOptions>();
    await createProject(projectName, options);
  });

program
  .command('new')
  .alias("default")
  .description('Quickly create a new Express API project')
  .argument('<project-name>', 'The name of the project to create')
  .action(async (projectName: string) => {
    const options = program.opts<ProjectOptions>();
    await createProject(projectName, options);
  });

program
  .command('init')
  .description('Start an interactive CLI to create a new project (coming soon)')
  .action(() => {
    console.log('Interactive init is not implemented yet. Use:');
    console.log('  auto-express <project-name>');
    console.log('  auto-express new <project-name>');
  });

const rawArgs = process.argv.slice(2);
if (rawArgs.includes('--h')) {
  console.log(`
Usage: auto-express <project-name>
       auto-express new <project-name>
       auto-express init

Options:
  --pm <packageManager>  Specify package manager (npm, yarn, pnpm) [default: npm]
  --type <project type>  Specify project type (mvc, api) [default: api]
  --install              Automatically install dependencies after project creation
  -h, --help             Display this help message
  -V, --version          Output the version number

Examples:
  auto-express my-app                    Create a new API project
  auto-express my-app --type mvc         Create a new MVC project
  auto-express my-app --pm yarn --install Create project and install with yarn
`);
  process.exit(0);
}

program.parse(process.argv);
