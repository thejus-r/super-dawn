package db

import (
	"context"
	"fmt"
	"log"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

func New(ctx context.Context, addr string, maxOpenConns, minConns int, maxIdleTime string) (*pgxpool.Pool, error) {
	dbConfig, err := pgxpool.ParseConfig(addr)
	if err != nil {
		return nil, fmt.Errorf("failed to parse config: %w", err)
	}

	dbConfig.MaxConns = int32(maxOpenConns)
	dbConfig.MinConns = int32(minConns)

	duration, err := time.ParseDuration(maxIdleTime)
	if err != nil {
		return nil, fmt.Errorf("failed to parse maxIdleTime: %w", err)
	}
	dbConfig.MaxConnIdleTime = duration

	pool, err := pgxpool.NewWithConfig(ctx, dbConfig)
	if err != nil {
		return nil, fmt.Errorf("failed to create connection pool: %w", err)
	}

	// Ping Database to check successful connection
	// with timeout of 5 seconds.
	pingCtx, cancel := context.WithTimeout(ctx, 5*time.Second)
	defer cancel()

	if err := pool.Ping(pingCtx); err != nil {
		pool.Close()
		return nil, fmt.Errorf("failed to ping database: %w", err)
	}

	log.Println("Database connection pool established successfully")
	return pool, nil
}
