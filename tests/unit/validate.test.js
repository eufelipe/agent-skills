import fs from 'fs';
import path from 'path';
import os from 'os';
import { describe, it, expect, afterEach } from 'vitest';
import {
  expandPath,
  existsAndIsObsidianVault,
} from '../../src/utils/validate.js';

const pkgJson = path.resolve(process.cwd(), 'package.json');

describe('expandPath', () => {
  it('expande ~/ para home + restante sem quebrar path.join', () => {
    const rel = `vitest-vault-${Date.now()}`;
    const expected = path.join(os.homedir(), rel);
    expect(expandPath(`~/${rel}`)).toBe(expected);
  });

  it('expande ~ sozinho para homedir', () => {
    expect(expandPath('~')).toBe(os.homedir());
  });

  it('resolve caminho relativo para absoluto', () => {
    const abs = expandPath('.');
    expect(path.isAbsolute(abs)).toBe(true);
  });

  it('mantém absoluto resolvido', () => {
    expect(expandPath('/tmp')).toBe(path.resolve('/tmp'));
  });

  it('rejeita vazio ou só espaços', () => {
    expect(() => expandPath('')).toThrow('Path inválido');
    expect(() => expandPath('   ')).toThrow('Path inválido');
    expect(() => expandPath(null)).toThrow('Path inválido');
  });

  it('rejeita ~usuário (tilde expansion não suportada)', () => {
    expect(() => expandPath('~outrouser/vault')).toThrow(
      'expansão de ~usuário não suportada'
    );
  });
});

describe('existsAndIsObsidianVault', () => {
  const created = [];

  afterEach(() => {
    while (created.length) {
      const p = created.pop();
      try {
        fs.rmSync(p, { recursive: true, force: true });
      } catch {
        /* ignore */
      }
    }
  });

  function track(dir) {
    created.push(dir);
    return dir;
  }

  it('retorna invalid quando caminho não existe', () => {
    const r = existsAndIsObsidianVault(
      path.join(os.tmpdir(), `nao-existe-${Date.now()}`)
    );
    expect(r).toEqual({ valid: false, message: 'Diretório não existe' });
  });

  it('retorna invalid quando é arquivo', () => {
    const r = existsAndIsObsidianVault(pkgJson);
    expect(r).toEqual({ valid: false, message: 'Caminho não é um diretório' });
  });

  it('retorna invalid sem marcadores de vault', () => {
    const dir = track(fs.mkdtempSync(path.join(os.tmpdir(), 'vault-')));
    const r = existsAndIsObsidianVault(dir);
    expect(r.valid).toBe(false);
    expect(r.message).toContain('.obsidian');
  });

  it('retorna valid com .obsidian/', () => {
    const dir = track(fs.mkdtempSync(path.join(os.tmpdir(), 'vault-')));
    fs.mkdirSync(path.join(dir, '.obsidian'));
    const r = existsAndIsObsidianVault(dir);
    expect(r).toEqual({ valid: true, path: path.resolve(dir) });
  });

  it('retorna valid com CONVENTIONS.md', () => {
    const dir = track(fs.mkdtempSync(path.join(os.tmpdir(), 'vault-')));
    fs.writeFileSync(path.join(dir, 'CONVENTIONS.md'), '# x\n', 'utf8');
    const r = existsAndIsObsidianVault(dir);
    expect(r).toEqual({ valid: true, path: path.resolve(dir) });
  });

  it('aceita path com tilde apontando para vault em home', () => {
    const name = `.vitest-obs-${Date.now()}`;
    const full = track(path.join(os.homedir(), name));
    fs.mkdirSync(full, { recursive: true });
    fs.mkdirSync(path.join(full, '.obsidian'));
    const r = existsAndIsObsidianVault(`~/${name}`);
    expect(r).toEqual({ valid: true, path: full });
  });

  it('symlink para vault válido é aceito', () => {
    const real = track(fs.mkdtempSync(path.join(os.tmpdir(), 'vault-')));
    fs.mkdirSync(path.join(real, '.obsidian'));
    const link = path.join(os.tmpdir(), `link-${Date.now()}`);
    fs.symlinkSync(real, link);
    created.push(link);
    const r = existsAndIsObsidianVault(link);
    expect(r.valid).toBe(true);
    expect(r.path).toBe(path.resolve(link));
  });

  it('retorna invalid para null, undefined ou vazio', () => {
    expect(existsAndIsObsidianVault('').valid).toBe(false);
    expect(existsAndIsObsidianVault('  ').valid).toBe(false);
    expect(existsAndIsObsidianVault(null).valid).toBe(false);
    expect(existsAndIsObsidianVault(undefined).valid).toBe(false);
  });
});
