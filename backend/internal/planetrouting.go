package internal

import (
	"database/sql"
	"log"

	"github.com/artjohan/cosmos-odyssey/backend/models"
)

func GetPlanets(db *sql.DB) []models.Planet {
	var planets []models.Planet
	rows, err := db.Query("SELECT * FROM planets")
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

	return planets
}

func GetRoutes(db *sql.DB) []models.Route {
	var routes = []models.Route{}
	return routes
}
