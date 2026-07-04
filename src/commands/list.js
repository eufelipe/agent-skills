import chalk from 'chalk';
import { getAllSkills } from '../utils/skills.js';

export function listCommand() {
  const skills = getAllSkills();
  if (skills.length === 0) {
    console.log(chalk.yellow('Nenhuma skill disponível.'));
    return;
  }

  console.log(chalk.bold('\nSkills disponíveis:\n'));
  for (const skill of skills) {
    console.log(
      `  ${chalk.cyan(skill.name)}  v${skill.version} — ${skill.description}`
    );
    console.log(`    targets: ${skill.targets.join(', ')}`);
  }
  console.log(
    `\nUse '${chalk.cyan('npx @eufelipe/agent-skills info <skill>')}' para detalhes.`
  );
}
