package pricelists

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"time"

	"github.com/artjohan/cosmos-odyssey/backend/models"
)

func UpdatePricelists(db *sql.DB) {
	response, err := http.Get("https://cosmos-odyssey.azurewebsites.net/api/v1.0/TravelPrices")
	if err != nil {
		log.Println("Error making GET request:", err)
		return
	}
	defer response.Body.Close()

	if response.StatusCode != http.StatusOK {
		log.Println("Request failed with status:", response.Status)
		return
	}

	var pricelist models.Pricelist
	decoder := json.NewDecoder(response.Body)
	err = decoder.Decode(&pricelist)
	if err != nil {
		log.Println("Error decoding JSON:", err)
		return
	}

	statement := "SELECT EXISTS (SELECT 1 FROM pricelists WHERE uuid = ?) AS uuid_exists"

	var uuidExists bool
	err = db.QueryRow(statement, pricelist.ID).Scan(&uuidExists)
	if err != nil {
		log.Println("Error checking for UUID existence:", err)
		return
	}

	if !uuidExists {
		addPricelist(db, pricelist)
	}
}

func GetCurrentPricelistExpirationTime(db *sql.DB) (time.Duration, error) {
	row := db.QueryRow("SELECT valid_until FROM pricelists ORDER BY valid_until DESC LIMIT 1")

	var validUntil time.Time
	err := row.Scan(&validUntil)
	if err != nil {
		return 0, err
	}

	remainingTime := time.Until(validUntil)
	return remainingTime, nil
}
