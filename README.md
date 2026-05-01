# AUbum da Copa 2026 - Backend

Backend do AUbum da Copa, uma plataforma de acompanhamento do album de figurinhas
oficial da Copa do Mundo 2026 com secao de repetidas. O projeto segue o mesmo
padrao do finanzze-back (Express + Inversify + pg + TypeScript, em Clean
Architecture) e reutiliza a tabela `users` do projeto finanzze (mesmo banco
Postgres).

## Stack

- Node 18, TypeScript, Express
- Inversify (IoC container)
- Postgres (`pg`)
- Bcrypt para hash de senha

## Estrutura (Clean Architecture)

```
src/
  domain/           # DTOs
  app/
    @shared/        # interfaces (repositories, usecases, controllers)
    usecases/       # regras de negocio
    database-injection/  # container IoC
  infra/
    api/
      database/     # conexao postgres
      repositories/ # implementacoes dos repositorios
    http/routes/    # routers Express
  presentation/
    controllers/    # adaptadores HTTP
  scripts/          # seed das figurinhas
```

## Variaveis de ambiente

```
ENV=development|production
PORT=3000
DB_DEV_USER=
DB_DEV_PASSWORD=
DB_DEV_HOST=
DB_DEV_PORT=5432
DB_DEV_DATABASE=
DB_PROD_USER=
DB_PROD_PASSWORD=
DB_PROD_HOST=
DB_PROD_PORT=5432
DB_PROD_DATABASE=
```

## Banco de dados

Rode `sql/2026-04-18_create.sql`. Esse script cria a tabela `users` (se ainda
nao existir - mesma do finanzze) e as tabelas proprias do AUbum:
`aubum_stickers` e `aubum_user_stickers`.

## Seed de figurinhas

Depois das tabelas criadas, popule o catalogo oficial de 994 figurinhas (12
Grupos A-L com 4 selecoes x 20 cada = 960, mais Serie Especial FWC00-FWC19
(20) e CC1-CC14 (14) = 34) rodando:

```
npm run seed
```

A logica do seed e idempotente: se ja existirem exatamente 994 figurinhas nao
faz nada. Se existirem mas em quantidade diferente (catalogo antigo), limpa e
repopula - o que tambem zera `aubum_user_stickers` via `ON DELETE CASCADE`.

## Rodando

```
npm install
npm start         # dev (ts-node-dev)
npm run build && npm run start:prod
```

## Endpoints

| Metodo | Rota | Descricao |
| --- | --- | --- |
| POST | /api/user/create | Cadastro de usuario (reusa tabela users do finanzze) |
| POST | /api/user/login | Login |
| GET  | /api/aubum/stickers | Catalogo completo de figurinhas |
| GET  | /api/aubum/album/:userId | Album do usuario com progresso e secoes |
| POST | /api/aubum/increment | `{ userId, stickerId }` - marca +1 (1ª vez = tenho, demais = repetidas) |
| POST | /api/aubum/decrement | `{ userId, stickerId }` - reduz 1 (repetida ou do album) |
| GET  | /api/aubum/repetidas/:userId | Figurinhas repetidas (quantity > 1) |
| GET  | /api/aubum/troca/users | Lista usuarios com repetidas (nome + total de repetidas) |
| GET  | /api/aubum/troca/repetidas/:userId | Figurinhas repetidas de um usuario especifico (para troca) |
| DELETE | /api/aubum/reset/:userId | Reseta progresso do usuario |

## Regra de negocio principal

`aubum_user_stickers.quantity`:

- `0` - usuario ainda nao tem a figurinha
- `1` - tem uma vez (colada no album)
- `>=2` - tem 1 colada + (quantity - 1) repetidas

O endpoint `/api/aubum/increment` soma 1; `/api/aubum/decrement` subtrai 1 com
piso em 0.
