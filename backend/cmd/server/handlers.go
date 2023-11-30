package main

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/artjohan/cosmos-odyssey/backend/internal/booking"
	"github.com/artjohan/cosmos-odyssey/backend/internal/routing"
	"github.com/artjohan/cosmos-odyssey/backend/models"
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
	jsonData, err := json.Marshal(routing.GetPlanets(app.db))
	if err != nil {
		log.Println("Error converting planets struct into json", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(jsonData)
}

func (app *application) GetRoutesHandler(w http.ResponseWriter, r *http.Request) {
	origin := r.URL.Query().Get("origin")
	destination := r.URL.Query().Get("destination")

	jsonData, err := json.Marshal(routing.GetRoutes(app.db, origin, destination))
	if err != nil {
		log.Println("Error converting planets struct into json", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(jsonData)
}

func (app *application) PostBookingHandler(w http.ResponseWriter, r *http.Request) {
	var bookingInfo models.BookingInfo

	err := json.NewDecoder(r.Body).Decode(&bookingInfo)
	if err != nil {
		log.Println("Error decoding booking info into struct", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	err = booking.CreateBooking(app.db, bookingInfo)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("Booking successful"))
}
