package handler

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

// OnboardingData mirrors the JSON payload from the frontend
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

var dbpool *pgxpool.Pool

func init() {
	databaseUrl := os.Getenv("DATABASE_URL")
	if databaseUrl == "" {
		log.Fatal("FATAL: DATABASE_URL environment variable is not set.")
	}

	var err error
	config, err := pgxpool.ParseConfig(databaseUrl)
	if err != nil {
		log.Fatalf("FATAL: Unable to parse DATABASE_URL: %v
", err)
	}

	dbpool, err = pgxpool.NewWithConfig(context.Background(), config)
	if err != nil {
		log.Fatalf("FATAL: Unable to create connection pool: %v
", err)
	}
	log.Println("Database connection pool initialized successfully.")
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
	// In a real scenario, we would get this from a validated JWT.
	// For this test, we need a valid UUID from your 'profiles' table to test against.
	// IMPORTANT: Replace this with a real user ID from your database for testing.
	const placeholderUserID = "00000000-0000-0000-0000-000000000000" // <-- REPLACE IF NEEDED FOR TESTING

	var data OnboardingData
	if err := json.NewDecoder(r.Body).Decode(&data); err != nil {
		writeJSONError(w, "Invalid request body: "+err.Error(), http.StatusBadRequest)
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
	_, err := dbpool.Exec(context.Background(), query,
		placeholderUserID, data.DisplayName, data.UserRole, data.PreferredWebsiteLanguage,
		data.PreferredCourseExplanationLanguage, data.PreferredCourseMaterialLanguage,
		data.Major, data.MajorLevel, data.StudiedSubjects, data.InterestedMajors,
		data.Hobbies, data.SubscribedToNewsletter, data.ReceiveQuotes, data.Bio,
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
