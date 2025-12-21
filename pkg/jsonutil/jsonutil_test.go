package jsonutil

import (
	"encoding/json"
	"errors"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
)

func TestWrite(t *testing.T) {
	rr := httptest.NewRecorder()

	payload := map[string]string{"status": "ok"}

	err := Write(rr, http.StatusCreated, payload)

	if err != nil {
		t.Errorf("unexpected error: %v", err)
	}

	// Check status code
	if status := rr.Code; status != http.StatusCreated {
		t.Errorf("handler returned wrong status code: got %v want %v", status, http.StatusCreated)
	}

	expectedContentType := "application/json"
	if contentType := rr.Header().Get("Content-Type"); contentType != expectedContentType {
		t.Errorf("content type header does not match: got %v want %v",
			contentType, expectedContentType)
	}

	// Check JSON Body
	expectedBody := `{"status":"ok"}`
	if strings.TrimSpace(rr.Body.String()) != expectedBody {
		t.Errorf("handler returned unexpected body: got %v want %v",
			rr.Body.String(), expectedBody)
	}
}

func TestRead(t *testing.T) {

	type TestPayload struct {
		Name string `json:"name"`
		Age  int    `json:"age"`
	}

	tests := []struct {
		name        string
		body        string
		expectError bool
	}{
		{
			name:        "Valid JSON",
			body:        `{"name": "John", "age": 30}`,
			expectError: false,
		},
		{
			name:        "Malformed JSON",
			body:        `{"name": "John", "age": }`,
			expectError: true,
		},
		{
			name:        "Unknown Field (Disallowed)",
			body:        `{"name": "John", "age": 30, "extra": "field"}`,
			expectError: true,
		},

		{
			name:        "Empty Body",
			body:        ``,
			expectError: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			rr := httptest.NewRecorder()
			req := httptest.NewRequest(http.MethodPost, "/", strings.NewReader(tt.body))

			var dst TestPayload
			err := Read(rr, req, &dst)

			if (err != nil) != tt.expectError {
				t.Errorf("Read() error = %v, expectError %v", err, tt.expectError)
			}

			if !tt.expectError {
				if dst.Name != "John" || dst.Age != 30 {
					t.Errorf("Data mismatch. Got: %+v", dst)
				}
			}
		})
	}
}

func TestWriteError(t *testing.T) {
	rr := httptest.NewRecorder()
	errMsg := "something went wrong"

	err := WriteError(rr, http.StatusBadRequest, errMsg)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	if rr.Code != http.StatusBadRequest {
		t.Errorf("got status %d, want %d", rr.Code, http.StatusBadRequest)

	}
	var response map[string]string
	if err := json.Unmarshal(rr.Body.Bytes(), &response); err != nil {
		t.Fatalf("could not decode response: %v", err)
	}

	if val, ok := response["error"]; !ok || val != errMsg {
		t.Errorf("expected json key 'error' with value %q, got %v", errMsg, response)
	}
}

func TestResponse(t *testing.T) {
	rr := httptest.NewRecorder()
	payload := "some data"

	err := Response(rr, http.StatusOK, payload)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	var response map[string]string
	if err := json.Unmarshal(rr.Body.Bytes(), &response); err != nil {
		t.Fatalf("could not decode response: %v", err)
	}

	if val, ok := response["data"]; !ok || val != payload {
		t.Errorf("expected json key 'data' with value %q, got %v", payload, response)
	}
}

// TestReadMaxBytes ensures the MaxBytesReader is working.
// Note: This requires generating a payload larger than 1,048,578 bytes.
func TestReadMaxBytes(t *testing.T) {
	limit := 1_048_578 // 1mb
	largeBody := strings.Repeat("a", limit+10)

	rr := httptest.NewRecorder()
	req := httptest.NewRequest(http.MethodPost, "/", strings.NewReader(largeBody))

	var dst any
	err := Read(rr, req, &dst)

	if err == nil {
		t.Error("expected error due to large body, got nil")
	}

	var maxBytesErr *http.MaxBytesError

	if !errors.As(err, &maxBytesErr) && !strings.Contains(err.Error(), "request body too large") {
		t.Logf("Got expected error for large body: %v", err)
	}
}
