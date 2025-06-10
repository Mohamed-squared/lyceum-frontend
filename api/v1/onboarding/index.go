package handler

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

// The init() function runs once per serverless function instance.
// It's a great place to initialize the database connection pool.
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

// writeJSONError is a helper to send a standard JSON error response.
func writeJSONError(w http.ResponseWriter, message string, statusCode int) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	json.NewEncoder(w).Encode(map[string]string{"error": message})
}

// Handler is the main entry point for the Vercel serverless function.
func Handler(w http.ResponseWriter, r *http.Request) {
    // Vercel automatically handles CORS in production, but this is good for local/other environments.
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

	// Handle pre-flight CORS requests
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}

	if r.Method != http.MethodPost {
		writeJSONError(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// 1. Extract and Validate JWT
	authHeader := r.Header.Get("Authorization")
	if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
		writeJSONError(w, "Authorization header with Bearer token required", http.StatusUnauthorized)
		return
	}
	tokenString := strings.TrimPrefix(authHeader, "Bearer ")

	supabaseJWTSecret := os.Getenv("SUPABASE_JWT_SECRET")
	if supabaseJWTSecret == "" {
		log.Println("ERROR: SUPABASE_JWT_SECRET is not set on the server.")
		writeJSONError(w, "Internal server configuration error", http.StatusInternalServerError)
		return
	}

	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(supabaseJWTSecret), nil
	})

	if err != nil {
		writeJSONError(w, "Invalid token: "+err.Error(), http.StatusUnauthorized)
		return
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok || !token.Valid {
		writeJSONError(w, "Invalid token claims", http.StatusUnauthorized)
		return
	}
	userID, ok := claims["sub"].(string)
	if !ok || userID == "" {
		writeJSONError(w, "Invalid user ID in token", http.StatusUnauthorized)
		return
	}

	// 2. Decode Request Body
	var data OnboardingData
	if err := json.NewDecoder(r.Body).Decode(&data); err != nil {
		writeJSONError(w, "Invalid request body: "+err.Error(), http.StatusBadRequest)
		return
	}

	// 3. Update Database
	// NOTE: The database schema in the prompt description did not have all these columns.
	// This query assumes they exist. The original prompt's query has been preserved.
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
		log.Printf("ERROR: Failed to update profile for user %s: %v", userID, err)
		writeJSONError(w, "Failed to update profile", http.StatusInternalServerError)
		return
	}

	log.Printf("INFO: Successfully updated profile for user %s", userID)

	// 4. Send Success Response
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Profile updated successfully"})
}
