package main

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"

	"github.com/artjohan/cosmos-odyssey/backend/models"
)

func (app *application) updatePricelists() {
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

	statement := "SELECT EXISTS (SELECT 1 FROM pricelists WHERE id = ?) AS uuid_exists"

	var uuidExists bool
	err = app.db.QueryRow(statement, pricelist.ID).Scan(&uuidExists)
	if err != nil {
		log.Println("Error checking for UUID existence:", err)
		return
	}

	if !uuidExists {
		addPricelist(app.db, pricelist)
	}
}

func addPricelist(db *sql.DB, pricelist models.Pricelist) {
	var pricelistCount int
	err := db.QueryRow("SELECT COUNT(*) FROM pricelists").Scan(&pricelistCount)
	if err != nil {
		log.Println("Error getting count from pricelists table:", err)
		return
	}

	if pricelistCount >= 15 {
		_, err := db.Exec("DELETE FROM pricelists WHERE validUntil = (SELECT MIN(validUntil) FROM pricelists)")
		if err != nil {
			log.Println("Error deleting oldest pricelist from table:", err)
			return
		}
	}

	addPricelistElementsToTable(db, pricelist)
}

func addPricelistElementsToTable(db *sql.DB, pricelist models.Pricelist) {
	statement := `INSERT INTO pricelists (id, validUntil) VALUES (?, ?)`
	_, err := db.Exec(statement, pricelist.ID, pricelist.ValidUntil)
	if err != nil {
		log.Println("Error inserting pricelist into table:", err)
		return
	}

	// adding all the legs and providers from the current pricelist to the corresponding tables
	for _, leg := range pricelist.Legs {
		statement := `INSERT INTO legs (id, pricelistId, originPlanet, destinationPlanet, distance) VALUES (?, ?, ?, ?, ?)`
		_, err := db.Exec(statement, leg.ID, pricelist.ID, leg.RouteInfo.From.Name, leg.RouteInfo.To.Name, leg.RouteInfo.Distance)
		if err != nil {
			log.Println("Error inserting leg into table:", err)
			return
		}

		for _, provider := range leg.Providers {
			statement := `INSERT INTO providers (id, legId, companyId, companyName, price, flightStart, flightEnd) VALUES (?, ?, ?, ?, ?, ?, ?)`
			_, err := db.Exec(statement, provider.ID, leg.ID, provider.Company.ID, provider.Company.Name, provider.Price, provider. FlightStart, provider.FlightEnd)
			if err != nil {
				log.Println("Error inserting provider into table:", err)
				return
			}
		}
	}
}
