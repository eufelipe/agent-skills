import chalk from 'chalk';
import ora from 'ora';
import {
  getSkill,
  getAllSkills,
  getSkillTemplate,
  validateSkill,
} from '../utils/skills.js';
import { existsAndIsObsidianVault } from '../utils/validate.js';
import { renderTemplate, buildTemplateVars } from '../utils/template.js';
import {
  promptVaultPath,
  confirmOverwrite,
  isInteractive,
} from '../utils/prompts.js';
import { getAdapter, DEFAULT_TARGET, listTargets } from '../adapters/index.js';

/**
 * @typedef {Object} InstallOptions
 * @property {string} [target]
 * @property {string} [vault]
 * @property {boolean} [project]
 * @property {boolean} [force]
 */

/**
 * @param {string} skillName
 * @param {InstallOptions} [options]
 */
export async function installCommand(skillName, options = {}) {
  const skill = getSkill(skillName);
  if (!skill) {
    console.error(chalk.red(`✗ Skill '${skillName}' não encontrada.`));
    const available = getAllSkills()
      .map(s => `  - ${s.name}`)
      .join('\n');
    if (available) {
      console.error(`\nSkills disponíveis:\n${available}`);
    }
    process.exitCode = 1;
    return;
  }
  validateSkill(skill);

  const target = options.target ?? DEFAULT_TARGET;
  const adapter = getAdapter(target);
  if (!adapter || !skill.targets.includes(target)) {
    console.error(
      chalk.red(
        `✗ Target '${target}' não suportado. Use: ${listTargets().join(', ')}`
      )
    );
    process.exitCode = 1;
    return;
  }

  let vaultPath;
  if (options.vault) {
    const result = existsAndIsObsidianVault(options.vault);
    if (!result.valid || !result.path) {
      console.error(chalk.red(`✗ Vault inválido: ${result.message}`));
      process.exitCode = 1;
      return;
    }
    vaultPath = result.path;
  } else if (isInteractive()) {
    console.log(chalk.bold('\n🔍 Verificando pré-requisitos...\n'));
    vaultPath = await promptVaultPath();
  } else {
    console.error(
      chalk.red(
        '✗ Informe o caminho do vault com --vault <path> (modo não-interativo).'
      )
    );
    process.exitCode = 1;
    return;
  }

  const template = getSkillTemplate(skillName);
  const content = renderTemplate(
    template,
    buildTemplateVars({ vaultPath, agent: target, skillName })
  );

  const spinner = ora(
    `Instalando skill '${skillName}' para ${target}...`
  ).start();

  const result = await adapter.install({
    skillName,
    content,
    force: Boolean(options.force),
    project: Boolean(options.project),
    /** @param {string} filePath */
    confirm: async filePath => {
      spinner.stop();
      if (!isInteractive()) {
        console.error(
          chalk.yellow(
            `Já existe ${filePath}. Use --force para sobrescrever (modo não-interativo).`
          )
        );
        return false;
      }
      return confirmOverwrite(filePath);
    },
  });

  if (!result.installed) {
    spinner.stop();
    console.log(chalk.yellow('✗ Instalação cancelada.'));
    process.exitCode = 1;
    return;
  }

  spinner.succeed(`Skill '${skillName}' instalada!`);
  console.log(`\n${chalk.green('✓')} Criado ${chalk.cyan(result.path)}`);
  console.log(`${chalk.green('✓')} Vault configurado: ${vaultPath}`);
  console.log(chalk.bold('\n🎉 Setup completo!\n'));
  console.log('Próximos passos:');
  console.log(
    '  1. Abra o Claude Code em qualquer projeto e use /second-brain'
  );
  console.log('     ou peça: "Salva no segundo cérebro: [conteúdo]"');
  console.log(
    `  2. Rode ${chalk.cyan('npx @eufelipe/agent-skills doctor')} para verificar o setup`
  );
}
