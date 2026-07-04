import Mustache from 'mustache';

/**
 * Renderiza um template Mustache sem escape de HTML
 * (paths como "~/Documents/Obsidian Vault" não podem ser corrompidos).
 *
 * @param {string} template
 * @param {Record<string, string>} vars
 */
export function renderTemplate(template, vars) {
  if (typeof template !== 'string' || template.trim() === '') {
    throw new Error('Template inválido: vazio');
  }
  return Mustache.render(template, vars, undefined, {
    escape: value => String(value),
  });
}

/**
 * Monta as variáveis padrão de renderização de uma skill.
 * `now` é injetável para tornar a data testável.
 *
 * @param {{ vaultPath: string, agent: string, skillName: string, now?: Date }} params
 */
export function buildTemplateVars({
  vaultPath,
  agent,
  skillName,
  now = new Date(),
}) {
  if (!vaultPath || String(vaultPath).trim() === '') {
    throw new Error('vaultPath é obrigatório para renderizar o template');
  }
  return {
    vault_path: vaultPath,
    agent,
    skill_name: skillName,
    date: now.toISOString().slice(0, 10),
  };
}
