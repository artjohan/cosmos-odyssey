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

	statement := "SELECT EXISTS (SELECT 1 FROM pricelists WHERE uuid = ?) AS uuid_exists"

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
	tx, err := db.Begin()
	if err != nil {
		log.Println("Error starting transaction:", err)
		return
	}
	defer func() {
		if err != nil {
			if rollbackErr := tx.Rollback(); rollbackErr != nil {
				log.Println("Error rolling back transaction:", rollbackErr)
			}
		}
	}()

	var pricelistCount int
	err = tx.QueryRow("SELECT COUNT(*) FROM pricelists").Scan(&pricelistCount)
	if err != nil {
		log.Println("Error getting count from pricelists table:", err)
		return
	}

	if pricelistCount >= 15 {
		_, err := tx.Exec("DELETE FROM pricelists WHERE valid_until = (SELECT MIN(valid_until) FROM pricelists)")
		if err != nil {
			log.Println("Error deleting oldest pricelist from table:", err)
			return
		}
	}

	addPricelistElementsToTable(tx, pricelist)

	err = tx.Commit()
	if err != nil {
		log.Println("Error committing transaction:", err)
		return
	}
}

func addPricelistElementsToTable(tx *sql.Tx, pricelist models.Pricelist) {
	statement := `INSERT INTO pricelists (uuid, valid_until) VALUES (?, ?)`
	result, err := tx.Exec(statement, pricelist.ID, pricelist.ValidUntil)
	if err != nil {
		log.Println("Error inserting pricelist into table:", err)
		return
	}

	pricelistId, err := result.LastInsertId()
	if err != nil {
		log.Println("Error getting pricelist ID:", err)
	}

	// adding all the legs and providers from the current pricelist to the corresponding tables
	for _, leg := range pricelist.Legs {
		fromPlanetId, toPlanetId := addPlanetAndReturnId(tx, leg.RouteInfo.From.Name), addPlanetAndReturnId(tx, leg.RouteInfo.To.Name)
		statement := `INSERT INTO legs (uuid, pricelist_id, origin_id, destination_id, distance) VALUES (?, ?, ?, ?, ?)`
		_, err := tx.Exec(statement, leg.ID, pricelistId, fromPlanetId, toPlanetId, leg.RouteInfo.Distance)
		if err != nil {
			log.Println("Error inserting leg into table:", err)
			return
		}

		legId, err := result.LastInsertId()
		if err != nil {
			log.Println("Error getting leg ID:", err)
		}

		for _, provider := range leg.Providers {
			companyId := addCompanyAndReturnId(tx, provider.Company.Name, provider.Company.ID)
			statement := `INSERT INTO providers (uuid, leg_id, company_id, price, flight_start, flight_end) VALUES (?, ?, ?, ?, ?, ?)`
			_, err := tx.Exec(statement, provider.ID, legId, companyId, provider.Company.Name, provider.Price, provider.FlightStart, provider.FlightEnd)
			if err != nil {
				log.Println("Error inserting provider into table:", err)
				return
			}
		}
	}
}

func addPlanetAndReturnId(tx *sql.Tx, planet string) int {
	statement := "INSERT OR IGNORE INTO planets(name) VALUES (?)"
	_, err := tx.Exec(statement, planet)
	if err != nil {
		log.Println("Error inserting item into planets:", err)
	}

	var returnPlanetId int
	err = tx.QueryRow("SELECT id FROM planets WHERE name = ?", planet).Scan(&returnPlanetId)
	if err != nil {
		log.Println("Error retrieving ID for planet:", err)
	}

	return returnPlanetId
}

func addCompanyAndReturnId(tx *sql.Tx, name, uuid string) int {
	statement := "INSERT OR IGNORE INTO companies(name, uuid) VALUES (?, ?)"
	_, err := tx.Exec(statement, name, uuid)
	if err != nil {
		log.Println("Error inserting item into companies:", err)
	}
	var returnCompanyId int
	err = tx.QueryRow("SELECT id FROM companies WHERE name = ?", name).Scan(&returnCompanyId)
	if err != nil {
		log.Println("Error retrieving ID for company:", err)
	}

	return returnCompanyId
}
