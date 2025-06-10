// Path: api/v1/onboarding.go
package v1

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v5"
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
	// This init function runs once when the serverless function is "warmed up".
	// We create the database connection pool here.
	databaseUrl := os.Getenv("DATABASE_URL")
	if databaseUrl == "" {
		log.Fatal("DATABASE_URL environment variable is not set.")
	}

	var err error
	dbpool, err = pgxpool.New(context.Background(), databaseUrl)
	if err != nil {
		log.Fatalf("Unable to create connection pool: %v
", err)
	}
}

// Handler is the main entry point for the Vercel serverless function.
func Handler(w http.ResponseWriter, r *http.Request) {
    // Set CORS headers for local development. Vercel handles this in production.
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	if r.Method != "POST" {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// --- JWT Authentication ---
	authHeader := r.Header.Get("Authorization")
	if authHeader == "" {
		http.Error(w, "Authorization header required", http.StatusUnauthorized)
		return
	}
	tokenString := strings.TrimPrefix(authHeader, "Bearer ")

	claims := jwt.MapClaims{}
	_, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		return []byte(os.Getenv("SUPABASE_JWT_SECRET")), nil
	})

	if err != nil {
		http.Error(w, "Invalid token", http.StatusUnauthorized)
		return
	}
	userID, ok := claims["sub"].(string)
	if !ok {
		http.Error(w, "Invalid subject in token", http.StatusUnauthorized)
		return
	}

	// --- Decode Body and Update Database ---
	var data OnboardingData
	if err := json.NewDecoder(r.Body).Decode(&data); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// --- Database Update Logic ---
	query := `
		UPDATE public.profiles
		SET display_name = $2, user_role = $3, preferred_website_language = $4,
			preferred_course_explanation_language = $5, preferred_course_material_language = $6,
			major = $7, major_level = $8, studied_subjects = $9, interested_majors = $10,
			hobbies = $11, subscribed_to_newsletter = $12, receive_quotes = $13, bio = $14,
			github_url = $15, has_completed_onboarding = TRUE, updated_at = $16
		WHERE id = $1;
	`
	_, err = dbpool.Exec(context.Background(), query,
		userID, data.DisplayName, data.UserRole, data.PreferredWebsiteLanguage,
		data.PreferredCourseExplanationLanguage, data.PreferredCourseMaterialLanguage,
		data.Major, data.MajorLevel, data.StudiedSubjects, data.InterestedMajors,
		data.Hobbies, data.SubscribedToNewsletter, data.ReceiveQuotes, data.Bio,
		data.GithubURL, time.Now(),
	)

	if err != nil {
		log.Printf("Failed to update profile for user %s: %v
", userID, err)
		http.Error(w, fmt.Sprintf("Failed to update profile: %v", err), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Profile updated successfully"})
}
