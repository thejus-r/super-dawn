package main

import (
	"fmt"
	"net/http"

	"github.com/thejus-r/super-dawn/internal/shared/middleware"
)

func handleHello(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("Hello World!"))
}

func main() {
	router := http.NewServeMux()

	v1 := http.NewServeMux()
	v1.HandleFunc("GET /hello", handleHello)

	router.Handle("/v1/", http.StripPrefix("/v1", v1))

	stack := middleware.CreateStack(
		middleware.Logging,
	)

	server := http.Server{
		Addr:    ":8080",
		Handler: stack(router),
	}

	fmt.Println("Server Listening on port 8080")
	server.ListenAndServe()
}
