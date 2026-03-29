import { spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const cli = join(root, 'bin/cli.js');

function run(args) {
  return spawnSync(process.execPath, [cli, ...args], {
    encoding: 'utf8',
    cwd: root,
    env: { ...process.env, NO_COLOR: '1' },
  });
}

describe('CLI (bin/cli.js)', () => {
  it('exibe ajuda com --help', () => {
    const r = run(['--help']);
    expect(r.status).toBe(0);
    expect(r.stderr).toBe('');
    expect(r.stdout).toContain('eufelipe-agent-skills');
    expect(r.stdout).toContain('install');
    expect(r.stdout).toContain('list');
    expect(r.stdout).toContain('info');
    expect(r.stdout).toContain('doctor');
  });

  it('exibe versão com --version', () => {
    const r = run(['--version']);
    expect(r.status).toBe(0);
    expect(r.stderr).toBe('');
    expect(r.stdout.trim()).toBe('1.0.0');
  });

  it('comando install (stub)', () => {
    const r = run(['install', 'minha-skill', '-t', 'cursor']);
    expect(r.status).toBe(0);
    expect(r.stdout).toContain('Comando install em desenvolvimento');
  });

  it('comando list (stub)', () => {
    const r = run(['list']);
    expect(r.status).toBe(0);
    expect(r.stdout).toContain('Comando list em desenvolvimento');
  });

  it('comando info (stub)', () => {
    const r = run(['info', 'x']);
    expect(r.status).toBe(0);
    expect(r.stdout).toContain('Comando info em desenvolvimento');
  });

  it('comando doctor (stub)', () => {
    const r = run(['doctor']);
    expect(r.status).toBe(0);
    expect(r.stdout).toContain('Comando doctor em desenvolvimento');
  });
});
