-- +goose Up
-- +goose StatementBegin
CREATE OR REPLACE FUNCTION set_updated_at_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
-- +goose StatementEnd

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS credentials (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    provider VARCHAR(24) NOT NULL, -- provider: email, google, etc
    provider_id VARCHAR(255) NOT NULL, -- providerId: john@mail.com, asdsda..(id)
    password VARCHAR(255), -- Optional password for email provider
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    -- Unique Constraint (Composite)
    UNIQUE (provider, provider_id)
);

CREATE TABLE IF NOT EXISTS sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token TEXT UNIQUE NOT NULL,
    ip_address INET,
    user_agent TEXT,
    is_revoked BOOLEAN DEFAULT FALSE,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Note: 'UNIQUE' above automatically indexes 'email'.
-- Explicitly naming an index is good practice if you want control over the name.
CREATE INDEX IF NOT EXISTS user_email_idx ON users (email);
CREATE INDEX IF NOT EXISTS sessions_token_idx ON sessions (token);
CREATE INDEX IF NOT EXISTS sessions_user_id_idx ON sessions (user_id);

-- Trigger for updated_at on users
CREATE TRIGGER set_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION set_updated_at_timestamp();

-- Trigger for updated_at on credentials
CREATE TRIGGER set_users_updated_at
BEFORE UPDATE ON credentials
FOR EACH ROW
EXECUTE FUNCTION set_updated_at_timestamp();

-- +goose Down
-- Dropping the table automatically drops the index and trigger attached to it.
DROP TABLE IF EXISTS credentials;
DROP TABLE IF EXISTS sessions;
DROP TABLE IF EXISTS users;

-- Drop the function last
DROP FUNCTION IF EXISTS set_updated_at_timestamp();
