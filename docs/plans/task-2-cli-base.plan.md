---
name: Task 2 CLI Base
overview: Criar o entry point `bin/cli.js` com os 4 comandos principais do CLI usando Commander.js, com actions placeholder, sem lógica de negócio.
todos:
  - id: criar-cli-js
    content: Criar bin/cli.js com shebang, imports ESM, configuração do programa e os 4 comandos com actions placeholder
    status: pending
  - id: chmod
    content: "Adicionar permissão de execução: chmod +x bin/cli.js"
    status: pending
  - id: testar-cli
    content: Testar --help, --version e todos os comandos (install, list, info, doctor)
    status: pending
  - id: taskmaster-done
    content: Marcar subtarefas 2.1–2.5 e tarefa 2 como done no Taskmaster
    status: pending
---

# Tarefa 2: Implementar CLI base com Commander

## Arquivos envolvidos

- [`bin/cli.js`](../../bin/cli.js) — criar do zero (entry point)
- [`package.json`](../../package.json) — já configurado com `bin` e `type: module` (sem alterações)

## Estrutura do `bin/cli.js`

```js
#!/usr/bin/env node
import { Command } from 'commander';
import chalk from 'chalk';

const program = new Command();

program
  .name('eufelipe-agent-skills')
  .description('CLI para instalar skills padronizadas em ferramentas de agentes')
  .version('1.0.0');

// 4 comandos com actions placeholder
program.command('install <skill>') // --target, --vault, --api-key, --with-mcp, --global
program.command('list')
program.command('info <skill>')
program.command('doctor')          // --target

program.parse();
```

## Fluxo de execução

```mermaid
flowchart LR
    cli["bin/cli.js"] --> install["install <skill>"]
    cli --> list["list"]
    cli --> info["info <skill>"]
    cli --> doctor["doctor"]
```

## Notas

- `bin/cli.js` é apenas roteamento — sem lógica de negócio
- Actions usam `chalk.yellow('Comando X em desenvolvimento...')` como placeholder
- Cada comando terá seu próprio arquivo em `src/commands/` nas tarefas seguintes
- Subtarefas 2.1 e 2.5 do Taskmaster são redundantes (dependências e `package.json` já prontos desde Tarefa 1)
