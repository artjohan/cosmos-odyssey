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

func getLayoverRoutesInfo(db *sql.DB, origin, destination string) []models.LayoverRoute {
	routes := findAllRoutes(db, origin, destination)

	// Print the routes
	for _, route := range routes {
		if len(route) > 1 {
			log.Println("Route:", route)
		}
	}

	var layoverRoutes = []models.LayoverRoute{}
	return layoverRoutes
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

func findAllRoutes(db *sql.DB, originName, destinationName string) [][]models.AlgoLeg {
	var routes [][]models.AlgoLeg
	visited := make(map[string]bool)
	currentRoute := []models.AlgoLeg{}

	findRoutesRecursive(db, originName, destinationName, visited, currentRoute, &routes)

	return routes
}

func findRoutesRecursive(db *sql.DB, currentName, destinationName string, visited map[string]bool, currentRoute []models.AlgoLeg, routes *[][]models.AlgoLeg) {
	if currentName == destinationName {
		*routes = append(*routes, append([]models.AlgoLeg(nil), currentRoute...))
		return
	}

	visited[currentName] = true

	query := `
		WITH LatestPricelist AS (
			SELECT id
			FROM pricelists
			ORDER BY valid_until DESC
			LIMIT 1
		)
		SELECT 
			l.id,
			l.origin_id,
			p1.name AS origin_name,
			l.destination_id,
			p2.name AS destination_name,
			l.distance,
			l.pricelist_id
		FROM legs AS l
		JOIN LatestPricelist AS lp ON l.pricelist_id = lp.id
		JOIN planets AS p1 ON l.origin_id = p1.id
		JOIN planets AS p2 ON l.destination_id = p2.id
		WHERE p1.name = ?;
	`

	rows, err := db.Query(query, currentName)
	if err != nil {
		log.Println("Error fetching elements from legs table", err)
	}
	defer rows.Close()

	for rows.Next() {
		var leg models.AlgoLeg
		if err := rows.Scan(&leg.ID, &leg.Origin.ID, &leg.Origin.Name, &leg.Destination.ID, &leg.Destination.Name, &leg.Distance, &leg.PricelistID); err != nil {
			log.Println("Error scanning elements into struct", err)
		}

		if !visited[leg.Destination.Name] {
			findRoutesRecursive(db, leg.Destination.Name, destinationName, visited, append(currentRoute, leg), routes)
		}
	}

	visited[currentName] = false
}
