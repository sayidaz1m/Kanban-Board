package model

type Task struct {
	ID    string `json:"id"`
	Title string `json:"title"`
	X     int    `json:"x"`
	Y     int    `json:"y"`
}
