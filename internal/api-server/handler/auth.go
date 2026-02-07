package handler

import (
	"net/http"
	"time"

	"github.com/thejus-r/super-dawn/internal/api-server/service"
	"github.com/thejus-r/super-dawn/internal/shared/apperrors"
	"github.com/thejus-r/super-dawn/internal/shared/web"
)

type AuthHandler struct {
	service *service.AuthService
}

func CreateAuthHandler(s *service.AuthService) *AuthHandler {
	return &AuthHandler{
		service: s,
	}
}

type RegisterRequest struct {
	Name     string `json:"name"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

// POST /auth/register
func (h *AuthHandler) Register(w http.ResponseWriter, r *http.Request) error {
	var reg RegisterRequest
	if err := web.ReadJson(w, r, &reg); err != nil {
		return apperrors.BadRequestError("invalid data", err)
	}

	token, err := h.service.RegisterWithEmail(
		r.Context(),
		reg.Name,
		reg.Email,
		reg.Password,
		r.UserAgent(),
		r.RemoteAddr,
	)

	if err != nil {
		return err
	}

	h.setSessionCookie(w, token)
	w.WriteHeader(http.StatusCreated)

	return web.JsonResponse(w, http.StatusCreated, map[string]string{"status": "created"})
}

func (h *AuthHandler) Login(w http.ResponseWriter, r *http.Request) error {
	return nil
}

func (h *AuthHandler) Logout(w http.ResponseWriter, r *http.Request) error {
	return nil
}

func (h *AuthHandler) setSessionCookie(w http.ResponseWriter, token string) {
	http.SetCookie(
		w,
		&http.Cookie{
			Name:     "session_id",
			Value:    token,
			Path:     "/",
			Expires:  time.Now().Add(7 * 24 * time.Hour),
			HttpOnly: true,
			Secure:   true,
			SameSite: http.SameSiteLaxMode,
		},
	)
}
