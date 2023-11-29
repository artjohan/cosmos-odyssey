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

func GetRoutes(db *sql.DB, origin, destination string) models.AllRoutes {
	var routes models.AllRoutes

	routes.DirectRoutes = getDirectRoutesInfo(db, origin, destination)
	routes.LayoverRoutes = getLayoverRoutesInfo(db, origin, destination)
	return routes
}

func getDirectRoutesInfo(db *sql.DB, origin, destination string) []models.Route {
	var routes = []models.Route{}

	query := `
		WITH LatestPricelist AS (
			SELECT id
			FROM pricelists
			ORDER BY valid_until DESC
			LIMIT 1
		)
		SELECT 
			p1.id AS origin_id,
			p1.name AS origin_name,
			p2.id AS destination_id,
			p2.name AS destination_name,
			c.id AS company_id,
			c.name AS company_name,
			pr.id,
			pr.price,
			pr.flight_start,
			pr.flight_end
		FROM legs AS l
		JOIN planets AS p1 ON l.origin_id = p1.id
		JOIN planets AS p2 ON l.destination_id = p2.id
		JOIN providers AS pr ON l.id = pr.leg_id
		JOIN companies AS c ON pr.company_id = c.id
		JOIN LatestPricelist AS lp ON l.pricelist_id = lp.id
		WHERE p1.name = ? AND p2.name = ?
	`
	rows, err := db.Query(query, origin, destination)
	if err != nil {
		log.Println("Error fetching route info from database", err)
	}

	for rows.Next() {
		var route models.Route
		err := rows.Scan(&route.Origin.ID, &route.Origin.Name, &route.Destination.ID,
			&route.Destination.Name, &route.Company.ID, &route.Company.Name, &route.ID, &route.Price, &route.FlightStart, &route.FlightEnd)
		if err != nil {
			log.Println("Error scanning planet into struct", err)
		}

		routes = append(routes, route)
	}

	return routes
}

