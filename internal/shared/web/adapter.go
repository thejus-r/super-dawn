package web

import (
	"errors"
	"log"
	"net/http"

	"github.com/thejus-r/super-dawn/internal/shared/apperrors"
)

type APIFunc func(w http.ResponseWriter, r *http.Request) error

func Make(h APIFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		err := h(w, r)

		if err != nil {
			respondWithError(w, err)
		}
	}
}

// handles app error Messages automatically
// defaults to internal server error, status code 500
func respondWithError(w http.ResponseWriter, err error) {
	c := http.StatusInternalServerError
	e := ErrorDetail{
		Msg:  "Internal Server Error",
		Code: "INTERNAL_ERROR",
	}

	var appErr *apperrors.Error

	if errors.As(err, &appErr) {
		e.Code = string(appErr.Type)
		e.Msg = appErr.Message

		switch appErr.Type {
		case apperrors.NotFound:
			c = http.StatusNotFound
		case apperrors.Conflict:
			c = http.StatusConflict
		case apperrors.BadRequest:
			c = http.StatusBadRequest
		case apperrors.Unauthorized:
			c = http.StatusUnauthorized
			e.Msg = "Invalid credentials"
		case apperrors.Internal:
			c = http.StatusInternalServerError
			e.Msg = "Internal Server Error"
			log.Printf("INTERNAL ERROR: %v", appErr.Err)

		default:
			log.Printf("Unknown AppError Type: %s", appErr.Type)
		}
	} else {
		log.Printf("UNHANDLED ERROR: %v", err)
	}

	if err := ErrorReponse(w, c, e); err != nil {
		log.Printf("Failed to write response: %v", err)
	}

}
