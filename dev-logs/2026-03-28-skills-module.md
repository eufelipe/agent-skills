# Dev Log — 2026-03-28

## Tarefa — Sistema de gerenciamento de skills (Task Master #3)

### Contexto

Implementar carregamento de `skill.yaml`, leitura de `template.md` e validação de campos obrigatórios, alinhado ao PRD/Task Master, com testes e type-check estável.

### O que foi feito

- Criado `src/utils/skills.js` com `SKILLS_DIR`, `getAllSkills`, `getSkill`, `getSkillTemplate` e `validateSkill`.
- Skill de exemplo `src/skills/second-brain/` com `skill.yaml` e `template.md`.
- Testes em `tests/unit/skills.test.js` (incluindo diretório sem YAML, ramo sem pasta de skills via mock de `existsSync`).
- `tsconfig.json`: `"types": ["node"]` e JSDoc mínimo em `skills.js` para `checkJs` strict.

### Decisões técnicas relevantes

| Decisão | Motivo |
|--------|--------|
| `readdirSync` com `withFileTypes` | Ignora arquivos soltos em `src/skills/` e só processa diretórios |
| Export de `SKILLS_DIR` | Permite teste de caminho e reuso pela CLI depois |
| Mock de `fs.existsSync` no teste | Cobre `getAllSkills` quando o diretório raiz não existe sem mover pastas |

### Arquivos criados/modificados

- `src/utils/skills.js` (novo)
- `src/skills/second-brain/skill.yaml`, `template.md` (novos)
- `tests/unit/skills.test.js` (novo)
- `tsconfig.json` (ajuste)
