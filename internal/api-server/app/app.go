package app

import (
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/thejus-r/super-dawn/internal/api-server/handler"
	"github.com/thejus-r/super-dawn/internal/api-server/router"
	"github.com/thejus-r/super-dawn/internal/api-server/service"
	"github.com/thejus-r/super-dawn/internal/shared/middleware"
)

type Config struct {
	Port int
	Env  string
}

type DBConfig struct {
	Addr         string
	MaxOpenConns int
	MinConns     int
	MaxIdleTime  string
}

type Application struct {
	Config Config
	DB     *pgxpool.Pool
}

func (app *Application) Serve() error {

	authService := service.NewAuthService(app.DB)

	authHandler := handler.CreateAuthHandler(authService)

	routeHandlers := router.AppRouter{
		AuthHandler: authHandler,
	}

	appRouter := http.NewServeMux()
	apiRouter := routeHandlers.RegisterRoutes()

	appRouter.Handle("/api/", http.StripPrefix("/api", apiRouter))

	appMiddlewareStack := middleware.CreateStack(
		middleware.Logging,
	)

	srv := &http.Server{
		Addr:         fmt.Sprintf(":%d", app.Config.Port),
		Handler:      appMiddlewareStack(appRouter),
		IdleTimeout:  time.Minute,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 30 * time.Second,
	}

	log.Printf("Starting %s server on %s", app.Config.Env, srv.Addr)
	return srv.ListenAndServe()
}
