package resource

import (
	"log"
	"log/slog"
	"net/http"

	"github.com/thejus-r/super-dawn/internal/resource/features/requirement"
	"github.com/thejus-r/super-dawn/internal/resource/storage"
	"github.com/thejus-r/super-dawn/pkg/db"
)

type App struct {
	server *http.Server
}

func InitApp(cfg *Config) *App {

	dbConn, err := db.New(
		cfg.dbCfg.addr,
		cfg.dbCfg.maxOpenConns,
		cfg.dbCfg.maxIdleConns,
		cfg.dbCfg.maxIdleTime,
	)

	if err != nil {
		log.Panic(err)
	}
	store := storage.InitStorage(dbConn)

	requirementSvc := requirement.InitService(store)
	requirementHdl := requirement.NewHandler(requirementSvc)

	mux := http.NewServeMux()
	requirementHdl.RegisterRoutes(mux)

	return &App{
		server: &http.Server{
			Addr:    cfg.addr,
			Handler: mux,
		},
	}
}

func (app *App) Run() error {

	slog.Info("resourse server started")
	return app.server.ListenAndServe()
}
