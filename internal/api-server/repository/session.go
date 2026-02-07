package repository

import (
	"context"
	"net"
	"time"
)

type Session struct {
	ID        int
	UserID    int
	Token     string
	IPAddress net.IP
	UserAgent string
	IsRevoked bool
	ExpiresAt time.Time
	CreatedAt time.Time
}

type SessionRepository struct {
	db DBTX
}

func (r *SessionRepository) Create(ctx context.Context, s *Session) error {
	query := `
		INSERT INTO sessions (user_id, token, ip_address, user_agent, expires_at)
		VALUES ($1, $2, $3, $4, $5)
		RETURNING id, created_at`

	row := r.db.QueryRow(ctx, query, s.UserID, s.Token, s.IPAddress, s.UserAgent, s.ExpiresAt)

	return row.Scan(
		&s.ID,
		&s.CreatedAt,
	)
}

func (r *SessionRepository) GetByToken(ctx context.Context, token string) (*Session, error) {
	query := `
		SELECT id, user_id, token, ip_address, user_agent, is_revoked, expires_at, created_at
		FROM sessions
		WHERE token = $1 AND is_revoked = false AND expires_at > NOW()`

	row := r.db.QueryRow(ctx, query, token)

	var s Session
	err := row.Scan(
		&s.ID, &s.UserID, &s.Token, &s.IPAddress,
		&s.UserAgent, &s.IsRevoked, &s.ExpiresAt, &s.CreatedAt,
	)

	if err != nil {
		return nil, err
	}

	return &s, nil
}

func (r *SessionRepository) Revoke(ctx context.Context, token string) error {
	query := `
		UPDATE sessions SET is_revoked = true WHERE token = $1`

	_, err := r.db.Exec(ctx, query, token)
	return err
}
