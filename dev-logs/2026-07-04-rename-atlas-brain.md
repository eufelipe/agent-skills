# Dev Log — 2026-07-04

## Tarefa — Renomear skill second-brain → atlas-brain

### Contexto

O nome `second-brain` colide com skills/comandos homônimos no ecossistema do Claude Code, disputando o gatilho. `atlas-brain` é único e amarra ao pipeline pessoal (Atlas processa o inbox do vault).

### O que foi feito

- `git mv src/skills/second-brain → src/skills/atlas-brain`
- Substituição de todas as referências em `src/`, `tests/`, `README.md` (gatilhos em linguagem natural — "salvar no segundo cérebro" — preservados; só o nome/paths mudou)
- Título do template atualizado; `skill.yaml` com novo nome e path de instalação
- Versão 0.1.0 → 0.1.1 (dispara publish automático no merge)
- Reinstalada localmente sob o novo nome; `~/.claude/skills/second-brain/` removida

### Decisões técnicas relevantes

| Decisão | Motivo |
|---|---|
| Manter frases de gatilho em pt-BR | são o conceito (segundo cérebro), não o nome do comando |
| Não publicar deprecação de second-brain no npm | o pacote 0.1.0 tinha ~horas de vida e nenhum usuário externo |

### Arquivos criados/modificados

- `src/skills/atlas-brain/` (renomeado), `src/commands/install.js`, `README.md`, `tests/*`, `package.json` (0.1.1)
