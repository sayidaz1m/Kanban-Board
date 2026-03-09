package main

import (
	"backend/internal/handler"
	"backend/internal/model"
	"log"
	"net/http"
)

func enableCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func main() {

	mux := http.NewServeMux()

	taskHandler := &handler.TaskHandler{
		Tasks: []model.Task{},
	}

	mux.HandleFunc("/tasks", func(w http.ResponseWriter, r *http.Request) {

		switch r.Method {

		case http.MethodGet:
			taskHandler.GetTasks(w, r)

		case http.MethodPost:
			taskHandler.CreateTask(w, r)

		case http.MethodPut:
			taskHandler.UpdateTask(w, r)

		case http.MethodDelete:
			taskHandler.DeleteTask(w, r)

		default:
			http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		}

	})

	edgeHandler := &handler.EdgeHandler{
		Edges: []model.Edge{},
	}

	mux.HandleFunc("/edges", func(w http.ResponseWriter, r *http.Request) {

		switch r.Method {

		case http.MethodGet:
			edgeHandler.GetEdges(w, r)

		case http.MethodPost:
			edgeHandler.CreateEdge(w, r)

		}

	})

	server := &http.Server{
		Addr:    ":8080",
		Handler: enableCORS(mux),
	}

	log.Println("server started on :8080")

	err := server.ListenAndServe()
	if err != nil {
		log.Fatal(err)
	}
}
