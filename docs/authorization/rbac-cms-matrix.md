# [MVP3] Backend: Matriz RBAC do CMS

## Contexto

Este documento define a matriz de autorização por role, recurso e ação para o CMS da API.

O objetivo é deixar explícito o que cada role pode fazer nos recursos administrativos, com comportamento de menor privilégio e deny by default para combinações não mapeadas.

Este documento não altera autenticação, middlewares, guards ou rotas já corrigidas no card #77. Ele serve apenas como especificação de regra de negócio e referência para backend, front e QA.

## Escopo

A matriz cobre os recursos administrativos do CMS atualmente expostos pela API:

- themes
- topics
- exercises

As ações consideradas neste card são:

- listar
- visualizar
- criar
- editar

A ação de remover/excluir fica fora do escopo deste documento e deve ser tratada em um card futuro, se necessário.

## Matriz RBAC

### Legenda

- `ALLOW` = ação permitida
- `DENY` = ação negada

### themes

| Role | Listar | Visualizar | Criar | Editar |
| --- | --- | --- | --- | --- |
| VIEWER | ALLOW | ALLOW | DENY | DENY |
| EDITOR | ALLOW | ALLOW | ALLOW | ALLOW |
| ADMIN | ALLOW | ALLOW | ALLOW | ALLOW |

### topics

| Role | Listar | Visualizar | Criar | Editar |
| --- | --- | --- | --- | --- |
| VIEWER | ALLOW | ALLOW | DENY | DENY |
| EDITOR | ALLOW | ALLOW | ALLOW | ALLOW |
| ADMIN | ALLOW | ALLOW | ALLOW | ALLOW |

### exercises

| Role | Listar | Visualizar | Criar | Editar |
| --- | --- | --- | --- | --- |
| VIEWER | ALLOW | ALLOW | DENY | DENY |
| EDITOR | ALLOW | ALLOW | ALLOW | ALLOW |
| ADMIN | ALLOW | ALLOW | ALLOW | ALLOW |

## Regras Gerais

- Deny by default para qualquer combinação de role, recurso e ação que não esteja explicitamente mapeada.
- A matriz deve ser a única referência de autorização granular para o CMS.
- O backend deve seguir essa matriz de forma consistente em todos os endpoints administrativos cobertos.
- Rotas públicas não fazem parte desta matriz e não devem ter comportamento alterado por este documento.

## Observações para Front e QA

- O front pode usar esta matriz como base para exibir ou ocultar ações de interface relacionadas ao CMS.
- O QA pode usar esta matriz para validar casos de acesso permitido e negado por role.
- Se houver inclusão de novos recursos ou ações, a matriz deve ser atualizada antes de qualquer uso em produção.
