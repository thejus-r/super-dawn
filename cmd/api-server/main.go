package main

import (
	"context"
	"log"
	"time"

	"github.com/thejus-r/super-dawn/internal/api-server/app"
	"github.com/thejus-r/super-dawn/internal/api-server/db"
)

func main() {

	cfg := app.Config{
		Port: 8080,
		Env:  "development",
	}

	dbCfg := app.DBConfig{
		Addr:         "postgresql://admin:password@localhost/dawn-db",
		MaxOpenConns: 10,
		MinConns:     1,
		MaxIdleTime:  "1m",
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	conn, err := db.New(ctx, dbCfg.Addr, dbCfg.MaxOpenConns, dbCfg.MinConns, dbCfg.MaxIdleTime)
	if err != nil {
		log.Fatalf("Database initialization failed: %v", err)
	}
	defer conn.Close()

	app := app.Application{
		Config: cfg,
		DB:     conn,
	}

	if err := app.Serve(); err != nil {
		log.Fatalf("Application failed to start: %v", err)
	}
}
