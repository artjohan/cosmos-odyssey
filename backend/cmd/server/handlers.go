package main

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/artjohan/cosmos-odyssey/backend/internal"
)

func (app *application) HomeHandler(w http.ResponseWriter, r *http.Request) {
	jsonData, err := json.Marshal(`Hello world`)
	if err != nil {
		log.Println(err)
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(jsonData)
}

func (app *application) GetPlanetsHandler(w http.ResponseWriter, r *http.Request) {
	jsonData, err := json.Marshal(internal.GetPlanets(app.db))
	if err != nil {
		log.Println("Error converting planets struct into json", err)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(jsonData)
}

func (app *application) GetRoutesHandler(w http.ResponseWriter, r *http.Request) {
	origin := r.URL.Query().Get("origin")
	destination := r.URL.Query().Get("destination")

	jsonData, err := json.Marshal(internal.GetRoutes(app.db, origin, destination))
	if err != nil {
		log.Println("Error converting planets struct into json", err)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(jsonData)
}
