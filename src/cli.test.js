const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

describe('CLI Argument Parsing', () => {
  const cliPath = path.join(process.cwd(), 'dist', 'index.js');

  const runCLI = (args, cwd = process.cwd()) => {
    const result = spawnSync('node', [cliPath, ...args], {
      cwd,
      encoding: 'utf-8',
    });

    if (result.error) {
      throw result.error;
    }

    if (result.status !== 0 && result.stderr) {
      throw new Error(result.stderr);
    }

    return result.stdout;
  };

  const uniqueProjectName = (prefix) =>
    `${prefix}-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

  let tmpDir;

  beforeEach(() => {
    // Create a fresh temp directory for each test
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'auto-express-test-'));
  });

  afterEach(() => {
    // Cleanup the entire temp directory
    if (fs.existsSync(tmpDir)) {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  });

  test('should display help message when --h is used', () => {
    const output = runCLI(['--h']);
    expect(output).toContain('Usage: auto-express <project-name>');
    expect(output).toContain('Options:');
    expect(output).toContain('-h, --help');
    expect(output).toContain('-V, --version');
  });

  test('should display version when --version is used', () => {
    const output = runCLI(['--version']);
    expect(output).toMatch(/\d+\.\d+\.\d+/);
  });

  test('should create a project with the specified name', () => {
    const projectName = uniqueProjectName('test-project');
    const projectPath = path.join(tmpDir, projectName);

    const output = runCLI([projectName], tmpDir);

    expect(output).toContain(`Creating a new Express project named: ${projectName}`);
    expect(output).toContain('Project setup complete!');
    expect(fs.existsSync(projectPath)).toBe(true);
    expect(fs.existsSync(path.join(projectPath, '.gitignore'))).toBe(true);
  });

  test('should create a project using the "new" command', () => {
    const projectName = uniqueProjectName('test-new-project');
    const projectPath = path.join(tmpDir, projectName);

    const output = runCLI(['new', projectName], tmpDir);

    expect(output).toContain(`Creating a new Express project named: ${projectName}`);
    expect(output).toContain('Project setup complete!');
    expect(fs.existsSync(projectPath)).toBe(true);
    expect(fs.existsSync(path.join(projectPath, '.gitignore'))).toBe(true);
  });
});
