

import * as fs from 'fs';
import * as path from 'path';
import { Command } from 'commander';
import { generateGitignoreContent } from './utils';


const program = new Command();

program
  .name('auto-express')
  .version('1.9.0')
  .description('A CLI to generate Express.js projects')
  .argument('<project-name>', 'The name of the project to create')
  .action((projectName) => {
    console.log(`Creating a new Express project named: ${projectName}`);
    

    const projectPath = path.join(process.cwd(), projectName);

  
    try {
      fs.mkdirSync(projectPath, { recursive: true });
      console.log(`✅ Directory created at: ${projectPath}`);
    } catch (error) {
      console.error('❌ Error creating project directory:', error);
      process.exit(1);
    }

 
    try {
      fs.writeFileSync(path.join(projectPath, '.gitignore'), generateGitignoreContent());
      console.log('✅ .gitignore file created.');
    } catch (error) {
      console.error('❌ Error creating .gitignore file:', error);
    }
    
    console.log('\n✨ Project setup complete!');
    console.log(`Maps into your new project: cd ${projectName}`);
  });

program.parse(process.argv);