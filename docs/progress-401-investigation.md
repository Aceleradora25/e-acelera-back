# Investigacao: 401 nas rotas de progresso

## Escopo
Rotas analisadas:
- GET /status/:topicId/item/:itemId
- PUT /status/:topicId/item/:itemId
- GET /status/:id/:idType
- GET /progress/:id/:idType

## Causa raiz identificada
1. O status 401 nao e retornado pelo controller de progresso. No codigo atual, 401 vem apenas de validateTokenMiddleware.
2. Isso indica que o 401 em producao ocorre antes da regra de negocio de progresso e aponta para problema de autenticacao/header (token ausente) ou excecao no middleware.
3. O itemId nulo/intermitente e uma segunda causa, ligada a montagem da rota no cliente (timing assincrono). Esse ponto pode gerar chamadas invalidas, mas nao explica sozinho o 401.

## Evidencias no backend
- validateTokenMiddleware retorna 401 quando o token nao vem no header Authorization.
- validateTokenMiddleware tambem retorna 401 se ocorrer excecao durante validacao/autenticacao.
- ProgressController nao retorna 401.

## Ajustes aplicados neste card
1. Logs diagnosticos no validateTokenMiddleware para diferenciar:
- token ausente
- falha na extracao de payload
- usuario nao encontrado
- excecao de autenticacao

2. Validacao de parametros de rota no ProgressController:
- bloqueia topicId/itemId vazios, null e undefined (inclusive como string)
- retorna 400 antes da chamada ao service
- loga contexto da requisicao para rastreio

3. CORS configuravel por ambiente no servidor:
- removeu origem fixa localhost
- adicionou suporte a lista de origens via CORS_ALLOWED_ORIGINS

## Hipotese principal para divergencia local x producao
- Local: token e origem estao alinhados, por isso funciona.
- Producao: em parte das chamadas o Authorization nao chega (ou chega invalido) e o middleware barra com 401.
- Em paralelo, o frontend dispara algumas requisicoes antes de resolver itemId/topicId, gerando parametros nulos/intermitentes.

## Proximos passos recomendados
1. Frontend: registrar logs antes da chamada contendo:
- rota final montada
- topicId e itemId
- presence check do token
- timestamp e estado de carregamento dos dados

2. Frontend: impedir chamada enquanto itemId/topicId estiverem indefinidos/nulos.

3. Integracao: comparar requests local vs producao no Network:
- Authorization (presenca e formato Bearer)
- URL final enviada
- Origin e resposta CORS

4. Deploy: configurar CORS_ALLOWED_ORIGINS com os dominios de producao e homologacao.

5. Operacao: acompanhar logs adicionados no backend por 24-48h para confirmar distribuicao das causas.
