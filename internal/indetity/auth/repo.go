package auth

import (
	"context"
	"database/sql"
	"errors"
)

type User struct {
	ID       int    `json:"id"`
	Email    string `json:"email"`
	Password string `json:"-"`
}

type Repository interface {
	GetUserByEmail(ctx context.Context, email string) (*User, error)
}

type repo struct {
	db *sql.DB
}

func NewRepository(db *sql.DB) Repository {
	return &repo{db: db}
}

func (r *repo) GetUserByEmail(ctx context.Context, email string) (*User, error) {
	u := &User{}

	query := "SELECT id, email, password FROM users WHERE email = $1"

	err := r.db.QueryRowContext(ctx, query, email).Scan(&u.ID, &u.Email, &u.Password)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, errors.New("user not found")
		}
		return nil, err
	}
	return u, nil
}
