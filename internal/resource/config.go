package resource

import (
	"github.com/thejus-r/super-dawn/pkg/env"
)

type Config struct {
	addr  string
	dbCfg dbConfig
	env   string
}

type dbConfig struct {
	addr         string
	maxOpenConns int
	maxIdleConns int
	maxIdleTime  string
}

// TODO: fix error cases when env variable is not present
func LoadConfig() (*Config, error) {
	return &Config{
		addr: env.GetString("APP_PORT", ":3000"),
		dbCfg: dbConfig{
			addr:         env.GetString("DB_DSN_RESOURCE", "test"),
			maxOpenConns: env.GetInt("DB_MAX_OPEN_CONNS", 30),
			maxIdleConns: env.GetInt("DB_MAX_IDLE_CONNS", 30),
			maxIdleTime:  env.GetString("DB_MAX_IDLE_TIME", "15m"),
		},
	}, nil
}
