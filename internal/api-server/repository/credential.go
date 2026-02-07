package repository

import (
	"context"
	"errors"
	"time"

	"github.com/jackc/pgx/v5"
)

type Credential struct {
	ID         int
	UserID     int
	Provider   string
	ProviderID string
	Password   string
	CreatedAt  time.Time
	UpdatedAt  time.Time
}

type CredentialRepository struct {
	db DBTX
}

func (r *CredentialRepository) Create(ctx context.Context, c *Credential) error {
	query := `
	INSERT INTO credentials (user_id, provider, provider_id, password)
	VALUES ($1, $2, $3, $4)
	RETURNING id, created_at, updated_at`

	row := r.db.QueryRow(ctx, query, c.UserID, c.Provider, c.ProviderID, c.Password)

	err := row.Scan(
		&c.ID,
		&c.CreatedAt,
		&c.UpdatedAt,
	)

	return err
}

func (r *CredentialRepository) GetByProvider(ctx context.Context, provider, providerID string) (*Credential, error) {
	query := `
	SELECT id, user_id, provider, provider_id, password, created_at, updated_at
	FROM credentials WHERE provider = $1 AND provider_id = $2`

	row := r.db.QueryRow(ctx, query, provider, providerID)

	var c Credential

	err := row.Scan(
		&c.ID,
		&c.UserID,
		&c.Provider,
		&c.ProviderID,
		&c.Password,
		&c.CreatedAt,
		&c.UpdatedAt,
	)

	if errors.Is(err, pgx.ErrNoRows) {
		return nil, nil
	}

	if err != nil {
		return nil, err
	}

	return &c, err
}
