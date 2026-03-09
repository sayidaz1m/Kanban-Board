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
	json.NewEncoder(w).Encode(h.Edges)
}

func (h *EdgeHandler) CreateEdge(w http.ResponseWriter, r *http.Request) {

	var edge model.Edge

	json.NewDecoder(r.Body).Decode(&edge)

	h.Edges = append(h.Edges, edge)

	json.NewEncoder(w).Encode(edge)
}
