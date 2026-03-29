import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import yaml from 'yaml';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const SKILLS_DIR = path.join(__dirname, '../skills');

/** @param {unknown} name */
function isValidSkillName(name) {
  if (typeof name !== 'string' || name.trim() === '') return false;
  return !name.includes('/') && !name.includes('\\') && !name.includes('..');
}

export function getAllSkills() {
  if (!fs.existsSync(SKILLS_DIR)) {
    return [];
  }
  const entries = fs.readdirSync(SKILLS_DIR, { withFileTypes: true });
  return entries
    .filter(
      /** @param {import('fs').Dirent} entry */ entry => entry.isDirectory()
    )
    .map(
      /** @param {import('fs').Dirent} entry */ entry => {
        const skillPath = path.join(SKILLS_DIR, entry.name, 'skill.yaml');
        if (!fs.existsSync(skillPath)) {
          return null;
        }
        const content = fs.readFileSync(skillPath, 'utf8');
        return yaml.parse(content);
      }
    )
    .filter(Boolean);
}

/** @param {string} name */
export function getSkill(name) {
  if (!isValidSkillName(name)) {
    return null;
  }
  const skillPath = path.join(SKILLS_DIR, name, 'skill.yaml');
  if (!fs.existsSync(skillPath)) {
    return null;
  }
  const content = fs.readFileSync(skillPath, 'utf8');
  return yaml.parse(content);
}

/** @param {string} skillName */
export function getSkillTemplate(skillName) {
  if (!isValidSkillName(skillName)) {
    throw new Error(`Nome de skill inválido: '${skillName}'`);
  }
  const templatePath = path.join(SKILLS_DIR, skillName, 'template.md');
  if (!fs.existsSync(templatePath)) {
    throw new Error(`Template não encontrado para skill '${skillName}'`);
  }
  return fs.readFileSync(templatePath, 'utf8');
}

/** @param {Record<string, unknown>} skill */
export function validateSkill(skill) {
  const required = ['name', 'description', 'version', 'targets'];
  for (const field of required) {
    const value = skill[field];
    if (!value || (Array.isArray(value) && value.length === 0)) {
      throw new Error(`Skill inválida: campo '${field}' obrigatório`);
    }
  }
  return true;
}
