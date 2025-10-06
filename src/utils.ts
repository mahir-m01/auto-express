import inquirer from 'inquirer';
import { PackageManager, ProjectType } from './type';
import { promises as fs } from 'fs';
import * as path from 'path';

export async function promptProjectType(
  defaultType: ProjectType = 'api',
): Promise<ProjectType> {
  const { projectType } = await inquirer.prompt([
    {
      type: 'list',
      name: 'projectType',
      message: 'Choose the project type: ',
      choices: [
        { name: 'API only {REST endpoints}', value: 'api' },
        { name: 'MVC {controllers + views}', value: 'mvc' },
      ],
      default: defaultType,
    },
  ]);

  return projectType;
}

export function generateGitignoreContent(): string {
  return `# Node modules
/node_modules

# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*

# Build output
/dist
/build

# Environment variables
.env
  `.trim();
}

export function generateReadmeContent(projectName: string) {
  return `# ${projectName}\n\nWelcome to your new Express project!`;
}

export async function generateExpressProjectMVC(
  projectPath: string,
  packageManager: PackageManager,
) {
  const projectName = path.basename(projectPath);
  const directories = [
    'src',
    'src/controllers',
    'src/routes',
    'src/models',
    'src/middleware',
    'src/views',
  ];

  await Promise.all(
    directories.map((dir) =>
      fs.mkdir(path.join(projectPath, dir), { recursive: true }),
    ),
  );

  const packageJson = {
    name: projectName,
    version: '1.0.0',
    private: true,
    main: 'src/server.js',
    type: 'commonjs',
    packageManager: packageManager,
    scripts: {
      dev: 'nodemon src/server.js',
      start: 'node src/server.js',
    },
    dependencies: {
      dotenv: '^16.4.5',
      express: '^4.19.2',
      ejs: '^3.1.10',
    },
    devDependencies: {
      nodemon: '^3.1.7',
    },
  };

  await fs.writeFile(
    path.join(projectPath, 'package.json'),
    `${JSON.stringify(packageJson, null, 2)}\n`,
    'utf8',
  );

  await fs.writeFile(
    path.join(projectPath, 'src', 'app.js'),
    `const path = require('path');
const express = require('express');
const routes = require('./routes');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use('/', routes);

module.exports = app;
`,
    'utf8',
  );

  await fs.writeFile(
    path.join(projectPath, 'src', 'server.js'),
    `const dotenv = require('dotenv');

dotenv.config();

const app = require('./app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(\`Server listening on port \${PORT}\`);
});
`,
    'utf8',
  );

  await fs.writeFile(
    path.join(projectPath, 'src', 'routes', 'index.js'),
    `const express = require('express');
const homeController = require('../controllers/home.controller');

const router = express.Router();

router.get('/', homeController.index);

module.exports = router;
`,
    'utf8',
  );

  await fs.writeFile(
    path.join(projectPath, 'src', 'controllers', 'home.controller.js'),
    `exports.index = (req, res) => {
  res.render('home', { title: 'Express MVC Starter' });
};
`,
    'utf8',
  );

  await fs.writeFile(
    path.join(projectPath, 'src', 'models', 'index.js'),
    `// Define your models here.
module.exports = {};
`,
    'utf8',
  );

  await fs.writeFile(
    path.join(projectPath, 'src', 'middleware', 'index.js'),
    `// Register your middleware functions here.
module.exports = {};
`,
    'utf8',
  );

  await fs.writeFile(
    path.join(projectPath, 'src', 'views', 'home.ejs'),
    `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title><%= title %></title>
  </head>
  <body>
    <h1><%= title %></h1>
    <p>Welcome to your Express MVC project.</p>
  </body>
</html>
`,
    'utf8',
  );

  await fs.writeFile(
    path.join(projectPath, '.env.example'),
    'PORT=3000\n',
    'utf8',
  );
}

export async function generateExpressProjectAPI(
  projectPath: string,
  packageManager: PackageManager,
) {
  const projectName = path.basename(projectPath);
  const directories = ['src', 'src/routes', 'src/models', 'src/middleware'];

  await Promise.all(
    directories.map((dir) =>
      fs.mkdir(path.join(projectPath, dir), { recursive: true }),
    ),
  );

  const packageJson = {
    name: projectName,
    version: '1.0.0',
    private: true,
    main: 'src/server.js',
    type: 'commonjs',
    packageManager: packageManager,
    scripts: {
      dev: 'nodemon src/server.js',
      start: 'node src/server.js',
    },
    dependencies: {
      dotenv: '^16.4.5',
      express: '^4.19.2',
    },
    devDependencies: {
      nodemon: '^3.1.7',
    },
  };

  await fs.writeFile(
    path.join(projectPath, 'package.json'),
    `${JSON.stringify(packageJson, null, 2)}\n`,
    'utf8',
  );

  // src/app.js
  await fs.writeFile(
    path.join(projectPath, 'src', 'app.js'),
    `const express = require('express');
const weatherRoutes = require('./routes/weather.routes');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/weather', weatherRoutes);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

module.exports = app;
`,
    'utf8',
  );

  // src/server.js
  await fs.writeFile(
    path.join(projectPath, 'src', 'server.js'),
    `const dotenv = require('dotenv');

dotenv.config();

const app = require('./app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(\`API server listening on port \${PORT}\`);
});
`,
    'utf8',
  );

  // src/routes/weather.routes.js (inline handler, no controller)
  await fs.writeFile(
    path.join(projectPath, 'src', 'routes', 'weather.routes.js'),
    `const express = require('express');
const { loadWeather } = require('../models/weather.model');

const router = express.Router();

router.get('/', async (_req, res) => {
  try {
    const weather = await loadWeather();
    res.json(weather);
  } catch (error) {
    res.status(500).json({ message: 'Failed to load weather data' });
  }
});

module.exports = router;
`,
    'utf8',
  );

  // src/models/weather.model.js
  await fs.writeFile(
    path.join(projectPath, 'src', 'models', 'weather.model.js'),
    `exports.loadWeather = async () => {
  // Replace this mock with a real data source.
  return {
    city: 'London',
    temperatureC: 12,
    condition: 'Cloudy',
    fetchedAt: new Date().toISOString(),
  };
};
`,
    'utf8',
  );

  // src/middleware/index.js
  await fs.writeFile(
    path.join(projectPath, 'src', 'middleware', 'index.js'),
    `// Register reusable middleware here.
module.exports = {};
`,
    'utf8',
  );

  // .env.example
  await fs.writeFile(
    path.join(projectPath, '.env.example'),
    'PORT=3000\n',
    'utf8',
  );
}
