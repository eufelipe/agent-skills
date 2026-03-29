# Dev Log — 2026-03-29

## Tarefa — Script `qa`, regra de início no Task Master e logs retroativos

### Contexto

O repositório documentava `npm run qa`, mas o script não existia (só `validate`). Faltava deixar explícito no fluxo: ao iniciar uma tarefa, usar `update_subtask` na primeira subtarefa junto com `set_task_status` → `in-progress`. As entregas das tarefas Task Master **#4** (second-brain) e **#5** (validação de vault) foram concluídas sem arquivo em `dev-logs/` — omissão do passo 6 do [dev-workflow](mdc:.cursor/rules/dev-workflow.mdc): o agente priorizou código + testes + MCP e não criou o markdown de fechamento.

### O que foi feito

- `package.json`: script `"qa": "npm run validate"` (lint + type-check + testes com cobertura).
- [dev-workflow.mdc](mdc:.cursor/rules/dev-workflow.mdc): início de tarefa com `set_task_status` + `update_subtask` na primeira subtarefa; ciclo por subtarefa com `update_subtask` ao iniciar e ao concluir; log em `dev-logs/` marcado como obrigatório ao fechar entrega.
- Este arquivo: registro **retroativo** do escopo das tarefas já entregues (para histórico).

### Retroativo — Tarefa #4 (second-brain)

- `src/skills/second-brain/skill.yaml`: metadata PRD (`author`, `targets` cursor/claude-code, `config.vault_path`, `files` com `.mdc`).
- `src/skills/second-brain/template.md`: instruções + variáveis Mustache + comentário HTML documentando placeholders.
- `tests/unit/skills.test.js`: asserts de `targets`, template e bloco `second-brain skill.yaml segue metadata e files do PRD`.

### Retroativo — Tarefa #5 (validação vault Obsidian)

- `src/utils/validate.js`: `expandPath` (`~/`, `~`, `resolve`) e `existsAndIsObsidianVault` (existência, diretório, `.obsidian/` ou `CONVENTIONS.md`, erros comuns).
- `tests/unit/validate.test.js`: casos felizes, inválidos, tilde, symlink.

### Decisões técnicas relevantes

| Decisão | Motivo |
| --- | --- |
| `qa` delega para `validate` | Um único pipeline de qualidade; evita drift entre comandos |
| `expandPath` com `~/` + `slice(2)` | Evita `path.join(home, '/x')` virar path absoluto errado no Node |
| Status `in-progress` só via `set_task_status` | `update_subtask` não altera status; serve para histórico textual |

### Arquivos criados/modificados (esta sessão de log/fluxo)

- `package.json`
- `.cursor/rules/dev-workflow.mdc`
- `dev-logs/2026-03-29-dev-workflow-qa-retro-logs.md` (este arquivo)
