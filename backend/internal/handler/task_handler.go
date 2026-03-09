package handler

import (
	"encoding/json"
	"net/http"

	"backend/internal/model"
)

type TaskHandler struct {
	Tasks []model.Task
}

// GET
func (h *TaskHandler) GetTasks(w http.ResponseWriter, r *http.Request) {

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(h.Tasks)
}

// POST
func (h *TaskHandler) CreateTask(w http.ResponseWriter, r *http.Request) {

	var task model.Task

	err := json.NewDecoder(r.Body).Decode(&task)
	if err != nil {
		http.Error(w, "invalid body", http.StatusBadRequest)
		return
	}

	h.Tasks = append(h.Tasks, task)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(task)

}

// DELETE
func (h *TaskHandler) DeleteTask(w http.ResponseWriter, r *http.Request) {

	id := r.URL.Query().Get("id")

	for i, task := range h.Tasks {
		if task.ID == id {
			h.Tasks = append(h.Tasks[:i], h.Tasks[i+1:]...)
			break
		}
	}

	w.WriteHeader(http.StatusOK)
}
