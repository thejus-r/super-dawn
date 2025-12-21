package main

import (
	"log"

	"github.com/thejus-r/super-dawn/internal/resource"
)

func main() {
	cfg, err := resource.LoadConfig()
	if err != nil {
		log.Fatalf("failed to load config: %v", err)
	}

	app := resource.InitApp(cfg)

	if err := app.Run(); err != nil {
		log.Fatalf("resource service crashed: %v", err)
	}
}
