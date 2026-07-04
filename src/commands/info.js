import chalk from 'chalk';
import { getSkill } from '../utils/skills.js';

/** @param {string} skillName */
export function infoCommand(skillName) {
  const skill = getSkill(skillName);
  if (!skill) {
    console.error(
      chalk.red(
        `✗ Skill '${skillName}' não encontrada. Use 'list' para ver disponíveis.`
      )
    );
    process.exitCode = 1;
    return;
  }

  console.log(`\n${chalk.bold(skill.name)}  v${skill.version}`);
  console.log('='.repeat(String(skill.name).length + 8));
  console.log(`\n${skill.description}`);
  console.log(`\nAutor: ${skill.author}`);
  console.log(`Targets suportados: ${skill.targets.join(', ')}`);

  const config = skill.config ?? {};
  const keys = Object.keys(config);
  if (keys.length > 0) {
    console.log('\nConfiguração:');
    for (const key of keys) {
      const entry = config[key];
      const required = entry?.required ? ' (obrigatório)' : '';
      console.log(`  - ${key}${required}: ${entry?.prompt ?? ''}`);
    }
  }

  console.log(
    `\nUso:\n  ${chalk.cyan(`npx @eufelipe/agent-skills install ${skill.name}`)}`
  );
}
