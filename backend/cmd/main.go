package main

import (
	"database/sql"
	"log"
	"net/http"

	"github.com/artjohan/cosmos-odyssey/backend/database"
)

type application struct {
	db *sql.DB
}

func main() {
	var app application
	db, err := database.OpenDatabase()
	if err != nil {
		log.Println("Error opening database:", err)
		return
	}
	app.db = db

	app.updatePriceLists()

	log.Println("Started go api server at http://localhost:8080/")
	err = http.ListenAndServe(":8080", app.server())
	if err != nil {
		log.Fatal(err)
	}
}
