package web

import (
	"encoding/json"
	"net/http"
)

type JsonError struct {
	Error ErrorDetail `json:"error"`
}

type JsonData struct {
	Data any `json:"data"`
}

type ErrorDetail struct {
	Msg  string `json:"message"`
	Code string `json:"code"`
}

func ReadJson(w http.ResponseWriter, r *http.Request, data any) error {
	maxBytes := 1_048_578 // 1mb
	r.Body = http.MaxBytesReader(w, r.Body, int64(maxBytes))

	decoder := json.NewDecoder(r.Body)
	decoder.DisallowUnknownFields()

	return decoder.Decode(data)
}

func WriteJson(w http.ResponseWriter, status int, data any) error {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	return json.NewEncoder(w).Encode(data)
}

func JsonResponse(w http.ResponseWriter, status int, data any) error {
	return WriteJson(w, status, &JsonData{data})
}

func ErrorReponse(w http.ResponseWriter, status int, errorDetail ErrorDetail) error {
	return WriteJson(w, status, &JsonError{errorDetail})
}
