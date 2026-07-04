import chalk from 'chalk';
import { getAllSkills } from '../utils/skills.js';
import { existsAndIsObsidianVault } from '../utils/validate.js';
import { getAdapter, DEFAULT_TARGET, listTargets } from '../adapters/index.js';

const VAULT_MARKER = /<!-- vault_path: (.+?) -->/;

/**
 * @typedef {Object} DoctorOptions
 * @property {string} [target]
 */

/** @param {DoctorOptions} [options] */
export function doctorCommand(options = {}) {
  const target = options.target ?? DEFAULT_TARGET;
  const adapter = getAdapter(target);
  if (!adapter) {
    console.error(
      chalk.red(
        `✗ Target '${target}' não suportado. Use: ${listTargets().join(', ')}`
      )
    );
    process.exitCode = 1;
    return;
  }

  console.log(chalk.bold('\n🔍 Diagnosticando setup...\n'));

  let problems = 0;
  let installedCount = 0;

  for (const skill of getAllSkills()) {
    if (!adapter.isInstalled(skill.name)) {
      console.log(
        `${chalk.yellow('-')} ${skill.name}: não instalada (use 'install ${skill.name}')`
      );
      continue;
    }
    installedCount += 1;

    const content = adapter.readInstalled(skill.name) ?? '';
    const match = content.match(VAULT_MARKER);
    if (!match) {
      console.log(
        `${chalk.red('✗')} ${skill.name}: SKILL.md instalado sem marcador de vault — reinstale com 'install ${skill.name}'`
      );
      problems += 1;
      continue;
    }

    const vaultPath = match[1].trim();
    const result = existsAndIsObsidianVault(vaultPath);
    if (!result.valid) {
      console.log(
        `${chalk.red('✗')} ${skill.name}: vault '${vaultPath}' inválido (${result.message}) — reinstale com 'install ${skill.name} --vault <path>'`
      );
      problems += 1;
      continue;
    }

    console.log(`${chalk.green('✓')} ${skill.name}: instalada`);
    console.log(`    vault OK: ${vaultPath}`);
  }

  if (problems > 0) {
    console.log(
      chalk.red(`\n${problems} problema(s) encontrado(s). Veja acima.`)
    );
    process.exitCode = 1;
    return;
  }

  if (installedCount === 0) {
    console.log(chalk.yellow('\nNenhuma skill instalada ainda.'));
    return;
  }

  console.log(chalk.green('\nTudo certo! ✓'));
}
