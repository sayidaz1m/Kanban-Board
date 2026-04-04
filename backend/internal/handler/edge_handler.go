package handler

import (
	"encoding/json"
	"net/http"

	"backend/internal/model"
)

type EdgeHandler struct {
	Edges []model.Edge
}

func (h *EdgeHandler) GetEdges(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	encoder := json.NewEncoder(w)
	encoder.SetIndent("", "  ")
	encoder.Encode(h.Edges)
}

func (h *EdgeHandler) CreateEdge(w http.ResponseWriter, r *http.Request) {

	var edge model.Edge

	json.NewDecoder(r.Body).Decode(&edge)

	h.Edges = append(h.Edges, edge)

	json.NewEncoder(w).Encode(edge)
}

func (h *EdgeHandler) DeleteEdge(w http.ResponseWriter, r *http.Request) {
	id := r.URL.Query().Get("id")
	if id == "" {
		http.Error(w, "missing id", http.StatusBadRequest)
		return
	}

	for i, edge := range h.Edges {
		if edge.ID == id {
			h.Edges = append(h.Edges[:i], h.Edges[i+1:]...)
			w.WriteHeader(http.StatusOK)
			return
		}
	}

	http.Error(w, "edge not found", http.StatusNotFound)
}
