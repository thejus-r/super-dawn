package jsonutil

import (
	"encoding/json"
	"net/http"
)

func Write(w http.ResponseWriter, status int, data any) error {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)

	return json.NewEncoder(w).Encode(data)
}
func Read(w http.ResponseWriter, r *http.Request, data any) error {
	maxBytes := 1_048_578 // 1mb
	r.Body = http.MaxBytesReader(w, r.Body, int64(maxBytes))

	decoder := json.NewDecoder(r.Body)
	decoder.DisallowUnknownFields()

	return decoder.Decode(data)
}

func WriteError(w http.ResponseWriter, status int, message string) error {
	type envelope struct {
		Error string `json:"error"`
	}

	return Write(w, status, &envelope{Error: message})
}

func Response(w http.ResponseWriter, status int, data any) error {
	type wrapper struct {
		Data any `json:"data"`
	}

	return Write(w, status, &wrapper{data})
}
