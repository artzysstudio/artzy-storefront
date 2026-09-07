import { spawnSync } from 'node:child_process';
import { rmSync } from 'node:fs';

rmSync('.next', { recursive: true, force: true });
const result = spawnSync(
  process.execPath,
  ['node_modules/next/dist/bin/next', 'build', '--webpack'],
  {
    stdio: 'inherit',
    env: { ...process.env, ARTZY_STATIC_BUILD: '1' },
  },
);

if (result.error) throw result.error;
process.exit(result.status ?? 1);
