package auth

import (
	"crypto/rsa"
	"encoding/base64"
	"encoding/binary"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"math/big"
	"net/http"
	"strings"
	"sync"

	"github.com/golang-jwt/jwt/v5"
)

type Validator struct {
	jwksURL string
	cache   *jwksCache
	mu      sync.RWMutex
}

type jwksCache struct {
	Keys []jsonWebKey `json:"keys"`
}

type jsonWebKey struct {
	Kty string `json:"kty"`
	Kid string `json:"kid"`
	N   string `json:"n"`
	E   string `json:"e"`
}

func NewValidator(jwksURL string) (*Validator, error) {
	v := &Validator{jwksURL: jwksURL}

	if err := v.refreshKeys(); err != nil {
		return nil, fmt.Errorf("failed to fetch initial JWKS: %w", err)
	}

	return v, nil
}

func (v *Validator) Middleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")
		if !strings.HasPrefix(authHeader, "Bearer ") {
			http.Error(w, "Missing or invalid Authorization header", http.StatusUnauthorized)
			return
		}

		tokenString := strings.TrimPrefix(authHeader, "Bearer ")
		token, err := jwt.Parse(tokenString, v.getKey)

		if err != nil || !token.Valid {
			http.Error(w, "Unauthorized: "+err.Error(), http.StatusUnauthorized)
			return
		}

		next(w, r)
	}
}

func (v *Validator) getKey(token *jwt.Token) (any, error) {
	if _, ok := token.Method.(*jwt.SigningMethodRSA); !ok {
		return nil, fmt.Errorf("unexpected sigining method: %v", token.Header["alg"])
	}

	kid, ok := token.Header["kid"].(string)
	if !ok {
		return nil, errors.New("token header missing 'kid'")
	}

	pubKey, found := v.findKeyInCache(kid)
	if found {
		return pubKey, nil
	}

	log.Println("Key not found in cache, refreshing JWKS...")
	if err := v.refreshKeys(); err != nil {
		return nil, fmt.Errorf("failed to refresh JWKS: %v", err)
	}

	pubKey, found = v.findKeyInCache(kid)
	if found {
		return pubKey, nil
	}

	return nil, fmt.Errorf("key %v not found even after refresh", kid)

}

func (v *Validator) findKeyInCache(kid string) (*rsa.PublicKey, bool) {
	v.mu.RLock()
	defer v.mu.RUnlock()

	if v.cache == nil {
		return nil, false
	}

	for _, k := range v.cache.Keys {
		if k.Kid == kid {
			return buildPublicKey(k.N, k.E)
		}
	}

	return nil, false
}

func (v *Validator) refreshKeys() error {
	resp, err := http.Get(v.jwksURL)
	if err != nil {
		return err
	}

	defer resp.Body.Close()

	var newCache jwksCache
	if err := json.NewDecoder(resp.Body).Decode(&newCache); err != nil {
		return err
	}

	v.mu.Lock()
	v.cache = &newCache
	v.mu.Unlock()

	return nil
}

func buildPublicKey(nStr, eStr string) (*rsa.PublicKey, bool) {
	nBytes, err := base64.RawURLEncoding.DecodeString(nStr)
	if err != nil {
		return nil, false
	}
	n := new(big.Int).SetBytes(nBytes)

	eBytes, err := base64.RawURLEncoding.DecodeString(eStr)
	if err != nil {
		return nil, false
	}

	var e int
	if len(eBytes) < 4 {
		padded := make([]byte, 4)
		copy(padded[4-len(eBytes):], eBytes)
		e = int(binary.BigEndian.Uint32(padded))
	} else {
		e = int(binary.BigEndian.Uint32(eBytes))
	}

	return &rsa.PublicKey{N: n, E: e}, true

}
