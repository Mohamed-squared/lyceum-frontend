package handler

import (
	"encoding/json"
	"net/http"
)

// Handler is the minimal entry point for the Vercel serverless function.
func Handler(w http.ResponseWriter, r *http.Request) {
	// Set the content type header to signal a JSON response.
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)

	// Create and encode the response directly.
	json.NewEncoder(w).Encode(map[string]string{"message": "Go API is alive"})
}
