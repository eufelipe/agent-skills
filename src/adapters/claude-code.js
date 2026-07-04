import fs from 'fs';
import os from 'os';
import path from 'path';
import { isValidSkillName } from '../utils/skills.js';

/**
 * Adapter para Claude Code: instala skills como SKILL.md nativo
 * (padrão Agent Skills) em ~/.claude/skills/<skill>/ (global, default)
 * ou <cwd>/.claude/skills/<skill>/ (--project).
 */

export const name = 'claude-code';

export function describe() {
  return {
    name,
    label: 'Claude Code',
    location: '~/.claude/skills/<skill>/SKILL.md',
  };
}

/**
 * @typedef {Object} TargetPathOptions
 * @property {boolean} [project] instala no projeto atual em vez de global
 * @property {string} [cwd] diretório do projeto (default: process.cwd())
 * @property {string} [homeDir] home do usuário (default: os.homedir())
 */

/**
 * @param {string} skillName
 * @param {TargetPathOptions} [options]
 */
export function resolveTargetPath(skillName, options = {}) {
  if (!isValidSkillName(skillName)) {
    throw new Error(`Nome de skill inválido: '${skillName}'`);
  }
  const {
    project = false,
    cwd = process.cwd(),
    homeDir = os.homedir(),
  } = options;
  const base = project
    ? path.join(cwd, '.claude')
    : path.join(homeDir, '.claude');
  return path.join(base, 'skills', skillName, 'SKILL.md');
}

/**
 * Instala o conteúdo renderizado como SKILL.md.
 * `confirm` é um callback async injetado pelo comando (o adapter não
 * conhece inquirer — isso o mantém testável sem TTY).
 *
 * @param {Object} params
 * @param {string} params.skillName
 * @param {string} params.content
 * @param {boolean} [params.force]
 * @param {boolean} [params.project]
 * @param {string} [params.cwd]
 * @param {string} [params.homeDir]
 * @param {(filePath: string) => Promise<boolean>} [params.confirm]
 */
export async function install({
  skillName,
  content,
  force = false,
  project = false,
  cwd,
  homeDir,
  confirm,
}) {
  const targetPath = resolveTargetPath(skillName, { project, cwd, homeDir });

  if (fs.existsSync(targetPath) && !force) {
    const approved = confirm ? await confirm(targetPath) : false;
    if (!approved) {
      return { installed: false, skipped: true, path: targetPath };
    }
  }

  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  fs.writeFileSync(targetPath, content, 'utf8');
  return { installed: true, skipped: false, path: targetPath };
}

/**
 * @param {string} skillName
 * @param {TargetPathOptions} [options]
 */
export function isInstalled(skillName, options = {}) {
  return fs.existsSync(resolveTargetPath(skillName, options));
}

/**
 * Conteúdo do SKILL.md instalado, ou null se não instalado.
 *
 * @param {string} skillName
 * @param {TargetPathOptions} [options]
 */
export function readInstalled(skillName, options = {}) {
  const targetPath = resolveTargetPath(skillName, options);
  if (!fs.existsSync(targetPath)) {
    return null;
  }
  return fs.readFileSync(targetPath, 'utf8');
}
