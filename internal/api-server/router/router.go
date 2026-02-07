package router

import (
	"net/http"

	"github.com/thejus-r/super-dawn/internal/api-server/handler"
	"github.com/thejus-r/super-dawn/internal/shared/web"
)

// Create the Main Router

type AppRouter struct {
	AuthHandler *handler.AuthHandler
}

func (r *AppRouter) RegisterRoutes() *http.ServeMux {
	mux := http.NewServeMux()

	// v1 api endpoints
	v1 := http.NewServeMux()
	r.registerAuthRoutes(v1)
	mux.Handle("/v1/", http.StripPrefix("/v1", v1))

	return mux
}

func (r *AppRouter) registerAuthRoutes(mux *http.ServeMux) {
	mux.HandleFunc("POST /auth/register", web.Make(r.AuthHandler.Register))
	mux.HandleFunc("POST /auth/login", web.Make(r.AuthHandler.Login))
	mux.HandleFunc("POST /auth/logout", web.Make(r.AuthHandler.Logout))
}
