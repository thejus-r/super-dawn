package repository

import (
	"context"
	"time"
)

type User struct {
	ID        int
	Name      string
	Email     string
	CreatedAt time.Time
	UpdatedAt time.Time
}

type UserRepository struct {
	db DBTX
}

func (r *UserRepository) Create(ctx context.Context, name, email string) (*User, error) {
	query := `
		INSERT INTO users (name, email)
		VALUES ($1, $2)
		RETURNING id, name, email, created_at, updated_at`

	row := r.db.QueryRow(ctx, query, name, email)

	var user User
	err := row.Scan(
		&user.ID,
		&user.Name,
		&user.Email,
		&user.CreatedAt,
		&user.UpdatedAt,
	)

	if err != nil {
		return nil, err
	}

	return &user, err
}

func (r *UserRepository) GetByEmail(ctx context.Context, email string) (*User, error) {
	query := `
		SELECT
		id, name, email, created_at, updated_at
		FROM users WHERE email = $1`

	row := r.db.QueryRow(ctx, query, email)

	var user User
	err := row.Scan(
		&user.ID,
		&user.Name,
		&user.Email,
		&user.CreatedAt,
		&user.UpdatedAt,
	)

	if err != nil {
		return nil, err
	}

	return &user, nil
}
