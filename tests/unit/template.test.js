import { describe, it, expect } from 'vitest';
import { renderTemplate, buildTemplateVars } from '../../src/utils/template.js';

describe('renderTemplate', () => {
  it('substitui variáveis Mustache', () => {
    const out = renderTemplate('Olá {{name}}!', { name: 'Felipe' });
    expect(out).toBe('Olá Felipe!');
  });

  it('não escapa HTML em paths (espaços, &, /)', () => {
    const vaultPath = '/Users/x/Documents/Obsidian Vault & Notas';
    const out = renderTemplate('Vault: {{vault_path}}', {
      vault_path: vaultPath,
    });
    expect(out).toBe(`Vault: ${vaultPath}`);
    expect(out).not.toContain('&amp;');
  });

  it('lança para template vazio ou não-string', () => {
    expect(() => renderTemplate('', {})).toThrow('Template inválido: vazio');
    expect(() => renderTemplate('   ', {})).toThrow('Template inválido: vazio');
  });

  it('variável ausente vira string vazia (comportamento Mustache)', () => {
    expect(renderTemplate('a{{missing}}b', {})).toBe('ab');
  });
});

describe('buildTemplateVars', () => {
  it('monta vars com data YYYY-MM-DD a partir de now injetado', () => {
    const vars = buildTemplateVars({
      vaultPath: '/tmp/vault',
      agent: 'claude-code',
      skillName: 'second-brain',
      now: new Date('2026-07-04T15:30:00Z'),
    });
    expect(vars).toEqual({
      vault_path: '/tmp/vault',
      agent: 'claude-code',
      skill_name: 'second-brain',
      date: '2026-07-04',
    });
  });

  it('usa a data atual quando now não é informado', () => {
    const vars = buildTemplateVars({
      vaultPath: '/tmp/vault',
      agent: 'claude-code',
      skillName: 'second-brain',
    });
    expect(vars.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('lança quando vaultPath está vazio', () => {
    expect(() =>
      buildTemplateVars({ vaultPath: '', agent: 'x', skillName: 'y' })
    ).toThrow('vaultPath é obrigatório');
  });
});
