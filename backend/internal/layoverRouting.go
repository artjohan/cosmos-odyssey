package internal

import (
	"database/sql"
	"log"

	"github.com/artjohan/cosmos-odyssey/backend/models"
)

func getLayoverRoutesInfo(db *sql.DB, origin, destination string) []models.LayoverRoute {
	routes := findAllRoutes(db, origin, destination)
	var layoverRoutes = []models.LayoverRoute{}

	for _, route := range routes {
		log.Println(route)
		if len(route) > 6 {
			layoverRoutes := getLayoverRoutesForRoute(queryRouteData(db), route)
			for _, layoverRoute := range layoverRoutes {
				for i, v := range layoverRoute {
					log.Println(i, ":", v.FlightStart, v.FlightEnd)
				}
			}
		}
	}

	return layoverRoutes
}

func findAllRoutes(db *sql.DB, originName, destinationName string) [][]int {
	var routes [][]int
	visited := make(map[string]bool)
	currentRoute := []int{}

	findRoutesRecursive(db, originName, destinationName, visited, currentRoute, &routes)

	return routes
}

func findRoutesRecursive(db *sql.DB, currentName, destinationName string, visited map[string]bool, currentRoute []int, routes *[][]int) {
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
		var leg models.AlgoLeg
		if err := rows.Scan(&leg.ID, &leg.Origin.ID, &leg.Origin.Name, &leg.Destination.ID, &leg.Destination.Name); err != nil {
			log.Println("Error scanning elements into struct", err)
		}

		if !visited[leg.Destination.Name] {
			findRoutesRecursive(db, leg.Destination.Name, destinationName, visited, append(currentRoute, leg.ID), routes)
		}
	}

	visited[currentName] = false
}

func getLayoverRoutesForRoute(routeData []models.RouteData, routeIDs []int) [][]models.RouteData {
	var layoverRoutes [][]models.RouteData
	visited := make(map[int]bool)
	currentRoute := []models.RouteData{}

	findAllLayoverRoutes(routeData, routeIDs, visited, currentRoute, &layoverRoutes)

	return layoverRoutes
}

func filterProvidersByLeg(providers []models.RouteData, legId int) []models.RouteData {
	var filteredProviders []models.RouteData
	for _, provider := range providers {
		if provider.LegID == legId {
			filteredProviders = append(filteredProviders, provider)
		}
	}
	return filteredProviders
}

func findAllLayoverRoutes(routeData []models.RouteData, routeIDs []int, visited map[int]bool, currentRoute []models.RouteData, layoverRoutes *[][]models.RouteData) {
	if len(currentRoute) == len(routeIDs) {
		*layoverRoutes = append(*layoverRoutes, append([]models.RouteData(nil), currentRoute...))
		return
	}

	for _, legID := range routeIDs {
		if !visited[legID] {
			visited[legID] = true

			providers := filterProvidersByLeg(routeData, legID)
			for _, provider := range providers {
				if isValidLayover(routeData, currentRoute, provider) {
					findAllLayoverRoutes(routeData, routeIDs, visited, append(currentRoute, provider), layoverRoutes)
				}
			}

			visited[legID] = false
		}
	}
}

func isValidLayover(route, currentRoute []models.RouteData, provider models.RouteData) bool {
	if len(currentRoute) > 0 {
		lastLeg := currentRoute[len(currentRoute)-1]
		return lastLeg.FlightEnd.Before(provider.FlightStart)
	}
	return true
}

func queryRouteData(db *sql.DB) []models.RouteData {
	query := `
		WITH LatestPricelist AS (
			SELECT id
			FROM pricelists
			ORDER BY valid_until DESC
			LIMIT 1
		)
		SELECT 
			p.id,
			p.leg_id,
			p.flight_start,
			p.flight_end,
			p.price
		FROM providers AS p
		JOIN legs AS l ON l.id = p.leg_id
		JOIN LatestPricelist AS lp ON l.pricelist_id = lp.id
	`
	rows, err := db.Query(query)
	if err != nil {
		log.Fatal(err)
	}
	defer rows.Close()

	var routesData []models.RouteData
	for rows.Next() {
		var routeData models.RouteData
		if err := rows.Scan(&routeData.ID, &routeData.LegID, &routeData.FlightStart, &routeData.FlightEnd, &routeData.Price); err != nil {
			log.Fatal(err)
		}
		routesData = append(routesData, routeData)
	}

	return routesData
}
