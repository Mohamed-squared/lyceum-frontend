package handler

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	// Import the new postgres driver. The blank identifier _ is used because
	// we only need the driver's side effects (registering itself).
	_ "github.com/lib/pq"
)

// OnboardingData struct remains the same.
type OnboardingData struct {
	DisplayName                   string   `json:"displayName"`
	UserRole                      string   `json:"userRole"`
	PreferredWebsiteLanguage      string   `json:"preferred_website_language"`
	PreferredCourseExplanationLanguage string `json:"preferred_course_explanation_language"`
	PreferredCourseMaterialLanguage  string   `json:"preferred_course_material_language"`
	Major                         string   `json:"major"`
	MajorLevel                    string   `json:"major_level"`
	StudiedSubjects               []string `json:"studied_subjects"`
	InterestedMajors              []string `json:"interested_majors"`
	Hobbies                       []string `json:"hobbies"`
	SubscribedToNewsletter        bool     `json:"subscribed_to_newsletter"`
	ReceiveQuotes                 bool     `json:"receive_quotes"`
	Bio                           string   `json:"bio"`
	GithubURL                     string   `json:"github_url"`
}

// db is now a standard sql.DB connection pool.
var db *sql.DB

func init() {
	databaseUrl := os.Getenv("DATABASE_URL")
	if databaseUrl == "" {
		log.Fatal("FATAL: DATABASE_URL environment variable is not set.")
	}

	var err error
	// Use sql.Open to create the connection pool with the "postgres" driver.
	db, err = sql.Open("postgres", databaseUrl)
	if err != nil {
		log.Fatalf("FATAL: Unable to create database connection pool: %v
", err)
	}

	// Ping the database to ensure the connection is alive.
	err = db.Ping()
	if err != nil {
		log.Fatalf("FATAL: Unable to ping database: %v
", err)
	}

	log.Println("Database connection pool initialized successfully using lib/pq.")
}

func writeJSONError(w http.ResponseWriter, message string, statusCode int) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	json.NewEncoder(w).Encode(map[string]string{"error": message})
}

func Handler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}
	if r.Method != http.MethodPost {
		writeJSONError(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// --- Bypassing JWT validation for now ---
	const placeholderUserID = "00000000-0000-0000-0000-000000000000"

	var data OnboardingData
	if err := json.NewDecoder(r.Body).Decode(&data); err != nil {
		writeJSONError(w, "Invalid request body: "+err.Error(), http.StatusBadRequest)
		return
	}

	// Note: lib/pq uses $1, $2, etc. for parameters, same as pgx.
	// We need to convert the slice interests to a format pq can handle, like a JSON string.
	interestsJSON, err := json.Marshal(data.InterestedMajors)
	if err != nil {
		writeJSONError(w, "Failed to process interests data", http.StatusInternalServerError)
		return
	}
	studiedSubjectsJSON, err := json.Marshal(data.StudiedSubjects)
	if err != nil {
		writeJSONError(w, "Failed to process studied subjects data", http.StatusInternalServerError)
		return
	}
	hobbiesJSON, err := json.Marshal(data.Hobbies)
	if err != nil {
		writeJSONError(w, "Failed to process hobbies data", http.StatusInternalServerError)
		return
	}

	query := `
		UPDATE public.profiles
		SET display_name = $2, user_role = $3, preferred_website_language = $4,
			preferred_course_explanation_language = $5, preferred_course_material_language = $6,
			major = $7, major_level = $8, studied_subjects = $9, interested_majors = $10,
			hobbies = $11, subscribed_to_newsletter = $12, receive_quotes = $13, bio = $14,
			github_url = $15, has_completed_onboarding = TRUE, updated_at = $16
		WHERE id = $1;
	`
	// Use db.ExecContext for the query execution.
	_, err = db.ExecContext(context.Background(), query,
		placeholderUserID, data.DisplayName, data.UserRole, data.PreferredWebsiteLanguage,
		data.PreferredCourseExplanationLanguage, data.PreferredCourseMaterialLanguage,
		data.Major, data.MajorLevel, studiedSubjectsJSON, interestsJSON,
		hobbiesJSON, data.SubscribedToNewsletter, data.ReceiveQuotes, data.Bio,
		data.GithubURL, time.Now(),
	)

	if err != nil {
		log.Printf("ERROR: Failed to update profile for user %s: %v", placeholderUserID, err)
		writeJSONError(w, "Failed to update profile", http.StatusInternalServerError)
		return
	}

	log.Printf("INFO: Successfully updated profile for user %s", placeholderUserID)
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Profile updated successfully"})
}
