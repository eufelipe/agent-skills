import fs from 'fs';
import os from 'os';
import path from 'path';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  resolveTargetPath,
  install,
  isInstalled,
  readInstalled,
  describe as describeAdapter,
} from '../../../src/adapters/claude-code.js';
import {
  getAdapter,
  listTargets,
  DEFAULT_TARGET,
} from '../../../src/adapters/index.js';

/** @type {string} */
let fakeHome;

beforeEach(() => {
  fakeHome = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-skills-home-'));
});

afterEach(() => {
  fs.rmSync(fakeHome, { recursive: true, force: true });
});

describe('resolveTargetPath', () => {
  it('resolve global em <home>/.claude/skills/<skill>/SKILL.md', () => {
    const p = resolveTargetPath('second-brain', { homeDir: fakeHome });
    expect(p).toBe(
      path.join(fakeHome, '.claude', 'skills', 'second-brain', 'SKILL.md')
    );
  });

  it('resolve --project em <cwd>/.claude/skills/<skill>/SKILL.md', () => {
    const p = resolveTargetPath('second-brain', {
      project: true,
      cwd: '/tmp/meu-projeto',
    });
    expect(p).toBe(
      path.join(
        '/tmp/meu-projeto',
        '.claude',
        'skills',
        'second-brain',
        'SKILL.md'
      )
    );
  });
});

describe('install', () => {
  it('cria diretórios e escreve o SKILL.md', async () => {
    const result = await install({
      skillName: 'second-brain',
      content: '# conteúdo',
      homeDir: fakeHome,
    });
    expect(result.installed).toBe(true);
    expect(fs.readFileSync(result.path, 'utf8')).toBe('# conteúdo');
  });

  it('conflito sem force chama confirm; negado não sobrescreve', async () => {
    await install({ skillName: 's', content: 'v1', homeDir: fakeHome });
    const confirm = vi.fn().mockResolvedValue(false);
    const result = await install({
      skillName: 's',
      content: 'v2',
      homeDir: fakeHome,
      confirm,
    });
    expect(confirm).toHaveBeenCalledOnce();
    expect(result.installed).toBe(false);
    expect(result.skipped).toBe(true);
    expect(fs.readFileSync(result.path, 'utf8')).toBe('v1');
  });

  it('conflito com confirm aprovado sobrescreve', async () => {
    await install({ skillName: 's', content: 'v1', homeDir: fakeHome });
    const confirm = vi.fn().mockResolvedValue(true);
    const result = await install({
      skillName: 's',
      content: 'v2',
      homeDir: fakeHome,
      confirm,
    });
    expect(result.installed).toBe(true);
    expect(fs.readFileSync(result.path, 'utf8')).toBe('v2');
  });

  it('conflito com force sobrescreve sem chamar confirm', async () => {
    await install({ skillName: 's', content: 'v1', homeDir: fakeHome });
    const confirm = vi.fn();
    const result = await install({
      skillName: 's',
      content: 'v2',
      force: true,
      homeDir: fakeHome,
      confirm,
    });
    expect(confirm).not.toHaveBeenCalled();
    expect(fs.readFileSync(result.path, 'utf8')).toBe('v2');
  });

  it('conflito sem force e sem confirm não sobrescreve (não-interativo)', async () => {
    await install({ skillName: 's', content: 'v1', homeDir: fakeHome });
    const result = await install({
      skillName: 's',
      content: 'v2',
      homeDir: fakeHome,
    });
    expect(result.installed).toBe(false);
    expect(fs.readFileSync(result.path, 'utf8')).toBe('v1');
  });
});

describe('isInstalled / readInstalled', () => {
  it('refletem o estado real do filesystem', async () => {
    expect(isInstalled('s', { homeDir: fakeHome })).toBe(false);
    expect(readInstalled('s', { homeDir: fakeHome })).toBeNull();
    await install({ skillName: 's', content: 'abc', homeDir: fakeHome });
    expect(isInstalled('s', { homeDir: fakeHome })).toBe(true);
    expect(readInstalled('s', { homeDir: fakeHome })).toBe('abc');
  });
});

describe('registry', () => {
  it('expõe claude-code como default e único target do MVP', () => {
    expect(DEFAULT_TARGET).toBe('claude-code');
    expect(listTargets()).toEqual(['claude-code']);
    expect(getAdapter('claude-code')).not.toBeNull();
    expect(getAdapter('cursor')).toBeNull();
  });

  it('adapter descreve seu local de instalação', () => {
    expect(describeAdapter()).toMatchObject({
      name: 'claude-code',
      label: 'Claude Code',
    });
  });
});
