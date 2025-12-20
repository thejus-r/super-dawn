package main

import (
	"crypto/rand"
	"crypto/rsa"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"log"
	"math/big"
	"net/http"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

var (
	privateKey *rsa.PrivateKey
	publicKey  *rsa.PublicKey
	keyID      = "my-key-id-1"
)

func main() {
	var err error

	privateKey, err = rsa.GenerateKey(rand.Reader, 2048)
	if err != nil {
		log.Fatalf("Error generating keys: %v", err)
	}

	publicKey = &privateKey.PublicKey

	http.HandleFunc("POST /login", loginHandler)
	http.HandleFunc("/.well-known/jwks.json", jwksHandler)

	fmt.Println("Auth Server running on :8081")
	fmt.Println("  - Login Endpoint: http://localhost:8081/login")
	fmt.Println("  - JWKS Endpoint:  http://localhost:8081/.well-known/jwks.json")

	log.Fatal(http.ListenAndServe(":8081", nil))
}

func loginHandler(w http.ResponseWriter, r *http.Request) {
	claims := jwt.MapClaims{
		"sub":  "user-123",
		"name": "Alice Admin",
		"role": "admin",
		"iss":  "identity-server",
		"exp":  time.Now().Add(time.Hour * 1).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodRS256, claims)
	token.Header["kid"] = keyID

	tokenString, err := token.SignedString(privateKey)
	if err != nil {
		http.Error(w, "Failed to sign token", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"token": tokenString,
	})
}

func jwksHandler(w http.ResponseWriter, r *http.Request) {
	jwk := map[string]any{
		"kty": "RSA",
		"kid": keyID,
		"alg": "RS256",
		"use": "sig",
		"n":   base64.RawURLEncoding.EncodeToString(publicKey.N.Bytes()),
		"e":   base64.RawURLEncoding.EncodeToString(big.NewInt(int64(publicKey.E)).Bytes()),
	}

	jwks := map[string]any{
		"keys": []any{jwk},
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(jwks)
}
