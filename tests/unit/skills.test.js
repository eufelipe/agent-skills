import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { describe, it, expect, vi } from 'vitest';
import {
  SKILLS_DIR,
  getAllSkills,
  getSkill,
  getSkillTemplate,
  validateSkill,
} from '../../src/utils/skills.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const expectedSkillsRoot = path.resolve(__dirname, '../../src/skills');

describe('skills', () => {
  it('SKILLS_DIR aponta para src/skills', () => {
    expect(path.normalize(SKILLS_DIR)).toBe(path.normalize(expectedSkillsRoot));
  });

  it('getAllSkills retorna [] quando o diretório de skills não existe', () => {
    const original = fs.existsSync.bind(fs);
    const spy = vi.spyOn(fs, 'existsSync').mockImplementation(target => {
      if (path.normalize(String(target)) === path.normalize(SKILLS_DIR)) {
        return false;
      }
      return original(target);
    });
    try {
      expect(getAllSkills()).toEqual([]);
    } finally {
      spy.mockRestore();
    }
  });

  it('getAllSkills retorna array de skills com YAML válido', () => {
    const all = getAllSkills();
    expect(Array.isArray(all)).toBe(true);
    expect(all.length).toBeGreaterThan(0);
    const second = all.find(s => s?.name === 'second-brain');
    expect(second).toBeDefined();
    expect(second.description).toBeTruthy();
    expect(second.version).toBe('1.0.0');
    expect(second.targets).toEqual(['cursor', 'claude-code']);
  });

  it('getSkill carrega second-brain e getSkill inexistente retorna null', () => {
    const skill = getSkill('second-brain');
    expect(skill).not.toBeNull();
    expect(skill.name).toBe('second-brain');
    expect(getSkill('nao-existe')).toBeNull();
  });

  it('getSkillTemplate retorna conteúdo e lança se template ausente', () => {
    const body = getSkillTemplate('second-brain');
    expect(typeof body).toBe('string');
    expect(body).toContain('Second Brain — Instruções para Agentes');
    expect(body).toContain('{{vault_path}}');
    expect(body).toContain('{{agent}}');
    expect(body).toContain('{{date}}');
    expect(() => getSkillTemplate('skill-inexistente')).toThrow(
      "Template não encontrado para skill 'skill-inexistente'"
    );
  });

  it('second-brain skill.yaml segue metadata e files do PRD', () => {
    const skill = getSkill('second-brain');
    expect(skill).not.toBeNull();
    expect(skill.name).toBe('second-brain');
    expect(skill.author).toBe('eufelipe');
    expect(skill.config?.vault_path).toMatchObject({
      type: 'string',
      required: true,
      validate: 'existsAndIsObsidianVault',
    });
    expect(skill.files?.[0]).toMatchObject({
      template: 'template.md',
      target_cursor: '.cursor/rules/second-brain.mdc',
      target_claude: 'CLAUDE.md',
      mode: 'append',
    });
  });

  it('validateSkill aceita objeto completo e rejeita campos faltando', () => {
    const valid = {
      name: 'x',
      description: 'd',
      version: '1',
      targets: ['cursor'],
    };
    expect(validateSkill(valid)).toBe(true);

    for (const field of ['name', 'description', 'version', 'targets']) {
      const bad = { ...valid };
      delete bad[field];
      expect(() => validateSkill(bad)).toThrow(
        `Skill inválida: campo '${field}' obrigatório`
      );
    }
  });

  it('ignora entradas que não são diretório ou sem skill.yaml', () => {
    const orphan = path.join(SKILLS_DIR, '_orphan_file');
    fs.writeFileSync(orphan, 'x', 'utf8');
    try {
      const dirNoYaml = path.join(SKILLS_DIR, '_empty_skill_dir');
      fs.mkdirSync(dirNoYaml, { recursive: true });
      const all = getAllSkills();
      expect(all.every(s => s && typeof s === 'object')).toBe(true);
    } finally {
      fs.unlinkSync(orphan);
      fs.rmSync(path.join(SKILLS_DIR, '_empty_skill_dir'), {
        recursive: true,
        force: true,
      });
    }
  });
});
