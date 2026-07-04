---
name: second-brain
description: Salva notas no segundo cérebro (vault Obsidian) do usuário. Use quando o usuário pedir "salvar no segundo cérebro", "save to second brain", "anota no vault", "guarda isso no vault", "registra essa decisão/aprendizado/bug/lição", ou quando ao final de uma sessão de trabalho pedir para registrar o que foi aprendido ou decidido.
---

<!-- vault_path: {{vault_path}} -->
<!-- installed_by: @eufelipe/agent-skills ({{skill_name}}) em {{date}} para {{agent}} -->

# Second Brain — Salvar notas no vault Obsidian

O vault do usuário fica em: `{{vault_path}}`

Sua tarefa é criar UMA nota bem-formada em `{{vault_path}}/inbox/` com o conteúdo que o usuário quer guardar. O inbox é processado depois por outro agente (Atlas) — você NÃO classifica em pastas, NÃO move notas e NÃO verifica duplicatas (isso é trabalho do Atlas).

## Regras invioláveis

1. Crie arquivos SOMENTE em `{{vault_path}}/inbox/` — nunca em outra pasta do vault.
2. Nunca edite ou mova notas existentes do vault.
3. Uma nota por assunto — se o usuário pedir para salvar coisas distintas, crie uma nota para cada.

## Passo a passo

1. **Decida `type` e `domain`** pelo contexto do que está sendo salvo:
   - `type`: `claim` (afirmação verificável) · `method` (procedimento/how-to) · `decision` (ADR, escolha arquitetural) · `reference` (material externo: livro, artigo, curso) · `note` (genérica) · `bug` (bug documentado com solução) · `lesson` (lição aprendida)
   - `domain`: `eng` (engenharia, código, arquitetura) · `produto` (produto, validação, UX) · `ops` (operações, infra, automação) · `pessoal` (carreira, aprendizado, vida)
2. **Nome do arquivo**: kebab-case, sem espaços, português exceto termos técnicos, formato `tema-detalhe-contexto.md`. Exemplos:
   - `prisma-queryraw-melhor-para-or-dinamicos.md`
   - `react-hooks-pattern-use-previous.md`
   - `decision-syncthing-vs-obsidian-sync.md`
3. **Frontmatter mínimo** (obrigatório):

   ```yaml
   ---
   created_by: {{agent}}
   created_at: <data de HOJE em YYYY-MM-DD — a data em que a nota está sendo criada, NÃO a data de instalação desta skill>
   type: <type escolhido>
   domain: <domain escolhido>
   ---
   ```

   Campos opcionais, quando fizer sentido: `source` (URL, livro, PR), `project` (wikilink, ex.: "[[NomeDoProjeto]]"), `status: draft`, `subject` (lista hierárquica, ex.: `[react/hooks, prisma/migrations]`), `tags`, `related` (lista de wikilinks).

4. **Conteúdo**: conciso e direto; snippets de código quando relevante; wikilinks `[[...]]` para conceitos relacionados; contexto suficiente para ser entendido daqui a 6 meses sem esta conversa.
5. **Reporte** ao usuário o caminho completo do arquivo criado.

## Se o vault não existir ou estiver inacessível

- NÃO crie a nota em outro lugar.
- Avise o usuário com clareza, mostre o conteúdo formatado no chat para ele salvar manualmente e sugira rodar `npx @eufelipe/agent-skills doctor`.

## Referência

Regras completas do vault: `{{vault_path}}/CONVENTIONS.md`
