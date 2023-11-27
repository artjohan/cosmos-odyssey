package main

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"

	"github.com/artjohan/cosmos-odyssey/backend/models"
)

func (app *application) updatePriceLists() {
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

	var priceList models.PriceList
	decoder := json.NewDecoder(response.Body)
	err = decoder.Decode(&priceList)
	if err != nil {
		log.Println("Error decoding JSON:", err)
		return
	}

	statement := "SELECT EXISTS (SELECT 1 FROM priceLists WHERE id = ?) AS uuid_exists"

	var uuidExists bool
	err = app.db.QueryRow(statement, priceList.ID).Scan(&uuidExists)
	if err != nil {
		log.Println("Error checking for UUID existence:", err)
		return
	}

	if !uuidExists {
		addPriceList(app.db, priceList)
	}
}

func addPriceList(db *sql.DB, priceList models.PriceList) {
	var priceListCount int
	err := db.QueryRow("SELECT COUNT(*) FROM priceLists").Scan(&priceListCount)
	if err != nil {
		log.Println("Error getting count from priceLists table:", err)
		return
	}

	if priceListCount >= 15 {
		_, err := db.Exec("DELETE FROM priceLists WHERE validUntil = (SELECT MIN(validUntil) FROM priceLists)")
		if err != nil {
			log.Println("Error deleting oldest priceList from table:", err)
			return
		}
	}

	addPriceListElementsToTable(db, priceList)
}

func addPriceListElementsToTable(db *sql.DB, priceList models.PriceList) {
	statement := `INSERT INTO priceLists (id, validUntil) VALUES (?, ?)`
	_, err := db.Exec(statement, priceList.ID, priceList.ValidUntil)
	if err != nil {
		log.Println("Error inserting priceList into table:", err)
		return
	}

	// adding all the legs and providers from the current pricelist to the corresponding tables
	for _, leg := range priceList.Legs {
		statement := `INSERT INTO legs (id, priceListId, originPlanet, destinationPlanet, distance) VALUES (?, ?, ?, ?, ?)`
		_, err := db.Exec(statement, leg.ID, priceList.ID, leg.RouteInfo.From.Name, leg.RouteInfo.To.Name, leg.RouteInfo.Distance)
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
