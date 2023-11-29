package routing

import (
	"database/sql"
	"log"

	"github.com/artjohan/cosmos-odyssey/backend/models"
)

func findAllLegs(db *sql.DB, originName, destinationName string) [][]int {
	var routes [][]int
	visited := make(map[string]bool)
	currentRoute := []int{}

	findLegsRecursive(db, originName, destinationName, visited, currentRoute, &routes)

	return routes
}

func findLegsRecursive(db *sql.DB, currentName, destinationName string, visited map[string]bool, currentRoute []int, routes *[][]int) {
	if currentName == destinationName {
		*routes = append(*routes, append([]int(nil), currentRoute...))
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
			p2.name AS destination_name
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
		var leg models.Route
		if err := rows.Scan(&leg.ID, &leg.Origin.ID, &leg.Origin.Name, &leg.Destination.ID, &leg.Destination.Name); err != nil {
			log.Println("Error scanning elements into struct", err)
		}

		if !visited[leg.Destination.Name] {
			findLegsRecursive(db, leg.Destination.Name, destinationName, visited, append(currentRoute, leg.ID), routes)
		}
	}

	visited[currentName] = false
}
