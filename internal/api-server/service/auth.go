package service

import (
	"context"
	"crypto/rand"
	"encoding/base64"
	"fmt"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/thejus-r/super-dawn/internal/api-server/repository"
	"github.com/thejus-r/super-dawn/internal/shared/apperrors"
	"golang.org/x/crypto/bcrypt"
)

type AuthService struct {
	db *pgxpool.Pool
}

func NewAuthService(db *pgxpool.Pool) *AuthService {
	return &AuthService{db}
}

func generateRandomString(length int) (string, error) {
	b := make([]byte, length)
	_, err := rand.Read(b)
	if err != nil {
		return "", err
	}

	return base64.URLEncoding.EncodeToString(b), nil

}

func (s *AuthService) RegisterWithEmail(ctx context.Context, name, email, password, userAgent, ip string) (string, error) {
	hashedBytes, err := bcrypt.GenerateFromPassword([]byte(password), 12)
	if err != nil {
		return "", apperrors.InternalError("failed to hash password", err)
	}

	hashedPassword := string(hashedBytes)

	tx, err := s.db.Begin(ctx)

	if err != nil {
		return "", apperrors.InternalError("failed begin transaction", err)
	}

	defer tx.Rollback(ctx)

	repo := repository.NewRepository(tx)

	_, err = repo.Users.GetByEmail(ctx, email)

	if err != nil {
		return "", err
	}

	user, err := repo.Users.Create(ctx, name, email)
	if err != nil {
		return "", apperrors.InternalError("failed to create/find user", err)
	}

	existingCred, err := repo.Credentials.GetByProvider(ctx, "email", email)
	if err != nil {
		return "", apperrors.InternalError("failed to check provider", err)
	}

	if existingCred != nil {
		return "", apperrors.BadRequestError("user already has a password set. Please login", nil)
	}

	err = repo.Credentials.Create(ctx, &repository.Credential{
		UserID:     user.ID,
		Provider:   "email",
		ProviderID: email,
		Password:   hashedPassword,
	})

	if err != nil {
		return "", apperrors.InternalError("failed to create credential", err)
	}

	token, err := generateRandomString(24)

	if err != nil {
		return "", err
	}

	newSession := &repository.Session{
		UserID:    user.ID,
		Token:     token,
		UserAgent: userAgent,
		ExpiresAt: time.Now().Add(7 * 24 * time.Hour),
	}

	if err := repo.Sessions.Create(ctx, newSession); err != nil {
		return "", apperrors.InternalError("failed to create session", err)
	}

	if err := tx.Commit(ctx); err != nil {
		return "", err
	}

	return token, nil
}

func (s *AuthService) LoginWithEmail(ctx context.Context, email, password, userAgent, ip string) (string, error) {

	tx, err := s.db.Begin(ctx)

	if err != nil {
		return "", err
	}

	defer tx.Rollback(ctx)

	repo := repository.NewRepository(tx)

	cred, err := repo.Credentials.GetByProvider(ctx, "email", email)

	if err != nil {
		return "", fmt.Errorf("failed to create session: %w", err)
	}

	if cred == nil {
		return "", fmt.Errorf("user not found")
	}

	if err := bcrypt.CompareHashAndPassword([]byte(cred.Password), []byte(password)); err != nil {
		return "", fmt.Errorf("invalid password")
	}

	token, err := generateRandomString(24)

	if err != nil {
		return "", err
	}

	newSession := &repository.Session{
		UserID:    cred.UserID,
		Token:     token,
		UserAgent: userAgent,
		ExpiresAt: time.Now().Add(7 * 24 * time.Hour),
	}

	if err := repo.Sessions.Create(ctx, newSession); err != nil {
		return "", fmt.Errorf("failed to create session: %w", err)
	}

	if err := tx.Commit(ctx); err != nil {
		return "", err
	}

	return token, nil
}
