import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it, beforeEach, afterEach } from 'vitest';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const cli = join(root, 'bin/cli.js');

/** @type {string} */
let fakeHome;
/** @type {string} */
let fakeVault;

/**
 * Roda a CLI com HOME fake — os.homedir() respeita $HOME no POSIX,
 * então a instalação "global" cai dentro do diretório temporário.
 *
 * @param {string[]} args
 */
function run(args) {
  return spawnSync(process.execPath, [cli, ...args], {
    encoding: 'utf8',
    cwd: root,
    env: { ...process.env, NO_COLOR: '1', HOME: fakeHome },
  });
}

beforeEach(() => {
  fakeHome = fs.mkdtempSync(join(os.tmpdir(), 'agent-skills-e2e-home-'));
  fakeVault = fs.mkdtempSync(join(os.tmpdir(), 'agent-skills-e2e-vault-'));
  fs.mkdirSync(join(fakeVault, '.obsidian'));
});

afterEach(() => {
  fs.rmSync(fakeHome, { recursive: true, force: true });
  fs.rmSync(fakeVault, { recursive: true, force: true });
});

describe('e2e: install + doctor', () => {
  it('instala second-brain global e o doctor valida o setup', () => {
    const install = run([
      'install',
      'second-brain',
      '--vault',
      fakeVault,
      '--force',
    ]);
    expect(install.status).toBe(0);
    expect(install.stdout).toContain('Setup completo');

    const skillPath = join(
      fakeHome,
      '.claude',
      'skills',
      'second-brain',
      'SKILL.md'
    );
    expect(fs.existsSync(skillPath)).toBe(true);

    const content = fs.readFileSync(skillPath, 'utf8');
    expect(content).toMatch(/^---\nname: second-brain\n/);
    expect(content).toContain(`<!-- vault_path: ${fakeVault} -->`);
    expect(content).toContain(`${fakeVault}/inbox/`);
    expect(content).toContain('created_by: claude-code');
    expect(content).not.toContain('{{');

    const doctor = run(['doctor']);
    expect(doctor.status).toBe(0);
    expect(doctor.stdout).toContain('second-brain: instalada');
    expect(doctor.stdout).toContain(fakeVault);
  });

  it('reinstalação sem --force em modo não-interativo não sobrescreve', () => {
    expect(
      run(['install', 'second-brain', '--vault', fakeVault, '--force']).status
    ).toBe(0);

    const second = run(['install', 'second-brain', '--vault', fakeVault]);
    expect(second.status).toBe(1);
    expect(`${second.stdout}${second.stderr}`).toContain('--force');
  });

  it('doctor falha quando o vault deixa de existir', () => {
    expect(
      run(['install', 'second-brain', '--vault', fakeVault, '--force']).status
    ).toBe(0);

    fs.rmSync(fakeVault, { recursive: true, force: true });

    const doctor = run(['doctor']);
    expect(doctor.status).toBe(1);
    expect(doctor.stdout).toContain('inválido');
  });

  it('install --project instala em <cwd>/.claude/skills/', () => {
    const fakeProject = fs.mkdtempSync(
      join(os.tmpdir(), 'agent-skills-e2e-proj-')
    );
    try {
      const r = spawnSync(
        process.execPath,
        [
          cli,
          'install',
          'second-brain',
          '--vault',
          fakeVault,
          '--force',
          '--project',
        ],
        {
          encoding: 'utf8',
          cwd: fakeProject,
          env: { ...process.env, NO_COLOR: '1', HOME: fakeHome },
        }
      );
      expect(r.status).toBe(0);
      expect(
        fs.existsSync(
          join(fakeProject, '.claude', 'skills', 'second-brain', 'SKILL.md')
        )
      ).toBe(true);
    } finally {
      fs.rmSync(fakeProject, { recursive: true, force: true });
    }
  });
});
