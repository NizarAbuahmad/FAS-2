import { execSync } from 'child_process';

try {
  console.log('--- CURRENT WORKDIR ---');
  console.log(process.cwd());
  
  console.log('--- GIT STATUS ---');
  const status = execSync('git status', { encoding: 'utf8' });
  console.log(status);
  
  console.log('--- GIT DIFF FOR IMAGES ---');
  const diff = execSync('git diff --name-only', { encoding: 'utf8' });
  console.log(diff);
} catch (err) {
  console.error('Git error:', err.message);
  if (err.stdout) console.log('Stdout:', err.stdout);
  if (err.stderr) console.log('Stderr:', err.stderr);
}
