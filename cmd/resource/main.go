package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/thejus-r/super-dawn/pkg/auth"
)

func main() {
	authValidator, err := auth.NewValidator("http://localhost:8081/.well-known/jwks.json")
	if err != nil {
		log.Fatalf("Failed to initialize auth validator: %v", err)
	}

	mux := http.NewServeMux()
	protectedHandler := func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("Hello from Microservice A! You are authenticated"))
	}

	mux.HandleFunc("/api/data", authValidator.Middleware(protectedHandler))

	fmt.Println("Microservice A running on :8080")
	log.Fatal(http.ListenAndServe(":8080", mux))
}
