package main

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/artjohan/cosmos-odyssey/backend/models"
)

func (app *application) Home(w http.ResponseWriter, r *http.Request) {
	jsonData, err := json.Marshal(`Hello world`)
	if err != nil {
		log.Println(err)
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(jsonData)
}

func (app *application) GetPlanets(w http.ResponseWriter, r *http.Request) {
	var planets []models.Planet

	rows, err := app.db.Query("SELECT * FROM planets")
	if err != nil {
		log.Println("Error fetching planet info from database", err)
	}

	for rows.Next() {
		var planet models.Planet
		err := rows.Scan(&planet.ID, &planet.Name)
		if err != nil {
			log.Println("Error scanning planet into struct", err)
		}

		planets = append(planets, planet)
	}

	jsonData, err := json.Marshal(planets)
	if err != nil {
		log.Println("Error converting planets struct into json", err)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(jsonData)
}
