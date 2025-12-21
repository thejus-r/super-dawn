package requirement

import (
	"encoding/json"
	"log"
	"net/http"
)

type Handler struct {
	service *RequirementService
}

func NewHandler(s *RequirementService) *Handler {
	return &Handler{
		service: s,
	}
}

func (h *Handler) RegisterRoutes(mux *http.ServeMux) {
	mux.HandleFunc("POST /requirement", h.handleCreateRequirement)
	mux.HandleFunc("GET /requirement", h.handleListRequirements)
}

func (h *Handler) handleCreateRequirement(w http.ResponseWriter, r *http.Request) {

	w.Write([]byte("Created Requirement"))
}

func (h *Handler) handleListRequirements(w http.ResponseWriter, r *http.Request) {

	requirements, err := h.service.ListRequirements(r.Context())
	if err != nil {
		log.Fatal(err)
		w.Write([]byte("List Requirements"))
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(requirements)
}
