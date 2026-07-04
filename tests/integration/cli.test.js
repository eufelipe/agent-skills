import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const cli = join(root, 'bin/cli.js');
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));

/**
 * @param {string[]} args
 * @param {Record<string, string>} [extraEnv]
 */
function run(args, extraEnv = {}) {
  return spawnSync(process.execPath, [cli, ...args], {
    encoding: 'utf8',
    cwd: root,
    env: { ...process.env, NO_COLOR: '1', ...extraEnv },
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

  it('exibe versão com --version (dinâmica do package.json)', () => {
    const r = run(['--version']);
    expect(r.status).toBe(0);
    expect(r.stderr).toBe('');
    expect(r.stdout.trim()).toBe(pkg.version);
  });

  it('list mostra a skill second-brain', () => {
    const r = run(['list']);
    expect(r.status).toBe(0);
    expect(r.stdout).toContain('second-brain');
    expect(r.stdout).toContain('claude-code');
  });

  it('info second-brain mostra metadata', () => {
    const r = run(['info', 'second-brain']);
    expect(r.status).toBe(0);
    expect(r.stdout).toContain('second-brain');
    expect(r.stdout).toContain('Targets suportados: claude-code');
    expect(r.stdout).toContain('vault_path (obrigatório)');
  });

  it('info de skill inexistente falha com exit 1', () => {
    const r = run(['info', 'nao-existe']);
    expect(r.status).toBe(1);
    expect(r.stderr).toContain("Skill 'nao-existe' não encontrada");
  });

  it('install de skill inexistente falha e lista disponíveis', () => {
    const r = run(['install', 'nao-existe']);
    expect(r.status).toBe(1);
    expect(r.stderr).toContain("Skill 'nao-existe' não encontrada");
    expect(r.stderr).toContain('second-brain');
  });

  it('install com target não suportado falha com exit 1', () => {
    const r = run(['install', 'second-brain', '-t', 'vscode']);
    expect(r.status).toBe(1);
    expect(r.stderr).toContain("Target 'vscode' não suportado");
    expect(r.stderr).toContain('claude-code');
  });

  it('install sem --vault em modo não-interativo falha pedindo a flag', () => {
    const r = run(['install', 'second-brain']);
    expect(r.status).toBe(1);
    expect(r.stderr).toContain('--vault');
  });

  it('install com vault inválido falha com exit 1', () => {
    const r = run(['install', 'second-brain', '--vault', '/nao/existe/vault']);
    expect(r.status).toBe(1);
    expect(r.stderr).toContain('Vault inválido');
  });

  it('doctor com target não suportado falha com exit 1', () => {
    const r = run(['doctor', '-t', 'vscode']);
    expect(r.status).toBe(1);
    expect(r.stderr).toContain("Target 'vscode' não suportado");
  });
});
