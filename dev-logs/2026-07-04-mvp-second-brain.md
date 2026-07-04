# Dev Log — 2026-07-04

## Tarefa — Fechar MVP: skill second-brain para Claude Code + publicação npm

### Contexto

O projeto estava parado desde março com a base pronta (CLI Commander, loader de skills, validação de vault, QA) mas todos os comandos como stubs. Decisões que destravaram o MVP:

1. **Target único claude-code** (cursor → v1.1 via registry de adapters)
2. **SKILL.md nativo** em `~/.claude/skills/` (padrão Agent Skills) em vez de append no CLAUDE.md — habilita `/second-brain` em qualquer projeto
3. **Filesystem direto** em vez de MCP/Local REST API — o Claude Code escreve nativamente no vault; zero dependência de plugin/Obsidian aberto/API key
4. **Task Master removido** do repo (não é mais usado)

### O que foi feito

- **Fase A**: removidos `.taskmaster/`, comandos `tm` do Cursor, `mcp.json`s, `.env.example`; `dev-workflow.mdc` enxugado (sem seções TM); CLI sem `--api-key`/`--with-mcp`/`--global`, com `--project`/`--force`; dependência `node-fetch` removida
- **Fases B+E+F**: `src/utils/template.js` (Mustache sem escape HTML — paths com espaço), `src/utils/prompts.js` (inquirer com guard TTY); `skill.yaml` com novo schema (`files[].targets`, `replace-with-confirm`); `template.md` reescrito como template de SKILL.md alinhado ao CONVENTIONS.md real do vault (inbox-only, 7 types, 4 domains, kebab-case, marcador `<!-- vault_path -->` para o doctor)
- **Fase C**: `src/adapters/claude-code.js` (resolveTargetPath global/projeto, install com confirm injetável, isInstalled/readInstalled) + registry `src/adapters/index.js`
- **Fase D**: comandos `install`/`list`/`info`/`doctor` reais ligados no `bin/cli.js`
- **Fase G**: 61 testes (unit com HOME fake via mkdtemp, integration via spawn, e2e install+doctor+--project, prompts com inquirer mockado)
- **Fase H**: README pt-BR; package.json v0.1.0 + `prepublishOnly: qa` + `publishConfig.access: public`

### Decisões técnicas relevantes

| Decisão | Motivo |
|---|---|
| SKILL.md nativo global | `/second-brain` disponível em todo projeto; é o formato padrão de Agent Skills |
| Filesystem em vez de MCP | Claude Code tem Write nativo; plugin Local REST API nem estava instalado no vault |
| `confirm` como callback injetado no adapter | adapter testável sem TTY/inquirer |
| Marcador `<!-- vault_path: ... -->` no SKILL.md | permite ao `doctor` revalidar o vault sem estado extra |
| Types locais (`src/types/vendor.d.ts`) | evita instalar `@types/inquirer`/`@types/mustache` |
| `Mustache.escape` identidade | path "Obsidian Vault" tem espaço; escape HTML corromperia |
| v0.1.0 | espaço para 1.0.0 quando cursor entrar |

### Verificação real

- `npm run qa` verde (lint + tsc strict + 61 testes)
- Install real: `node bin/cli.js install second-brain --vault "<path-do-vault>"` → SKILL.md criado e renderizado corretamente; `doctor` → tudo OK
- `npm pack --dry-run`: 17 arquivos, 10.3 kB, sem testes/docs no pacote

### Arquivos criados/modificados

- `src/utils/{template,prompts}.js`, `src/types/vendor.d.ts` (novos)
- `src/adapters/{claude-code,index}.js` (novos)
- `src/commands/{install,list,info,doctor}.js` (novos)
- `src/skills/second-brain/{skill.yaml,template.md}` (reescritos)
- `bin/cli.js` (stubs → comandos reais)
- `tests/` (unit novos, integration reescrito, e2e novo)
- `README.md` (novo), `package.json`, `CLAUDE.md`, `.cursor/rules/dev-workflow.mdc`
- Removidos: `.taskmaster/`, `.cursor/commands/tm/`, `.cursor/rules/taskmaster/`, `.mcp.json`, `.cursor/mcp.json`, `.env.example`, `src/index.js`, `tests/unit/example.test.js`

### Pendências pós-log

- `npm publish --access public` (requer npm login)
- Ajustar default branch do GitHub de `feat/cli-base-commander` para `main`
- Sugestão fora do repo: adicionar `claude-code` à lista `created_by` do CONVENTIONS.md do vault
