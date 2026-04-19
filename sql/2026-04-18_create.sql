-- AUbum da Copa 2026 - schema
-- Reutiliza a tabela `users` do projeto finanzze (mesmo banco).
-- Estas tabelas abaixo sao especificas do AUbum e nao conflitam com as do finanzze.

CREATE TABLE IF NOT EXISTS users(
    id uuid,
    name character varying,
    email character varying,
    password character varying,
    created_at date
);

CREATE TABLE IF NOT EXISTS aubum_stickers (
    id UUID PRIMARY KEY,
    code VARCHAR(16) NOT NULL UNIQUE,
    section VARCHAR(64) NOT NULL,
    team VARCHAR(64),
    player_name VARCHAR(128),
    position INTEGER NOT NULL,
    is_special BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_aubum_stickers_section ON aubum_stickers(section);
CREATE INDEX IF NOT EXISTS idx_aubum_stickers_position ON aubum_stickers(position);

CREATE TABLE IF NOT EXISTS aubum_user_stickers (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    sticker_id UUID NOT NULL REFERENCES aubum_stickers(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 0 CHECK (quantity >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ,
    UNIQUE(user_id, sticker_id)
);

CREATE INDEX IF NOT EXISTS idx_aubum_user_stickers_user ON aubum_user_stickers(user_id);
