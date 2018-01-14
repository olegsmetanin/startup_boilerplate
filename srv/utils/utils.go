package utils

import (
	"os"
)

// GetEnv - get env value with fallback
func GetEnv(key, fallback string) string {
	if value, ok := os.LookupEnv(key); ok {
		return value
	}
	return fallback
}
