-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS requirements (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255)
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS requirements;
-- +goose StatementEnd
