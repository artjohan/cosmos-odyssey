package routing

import (
	"database/sql"
	"log"

	"github.com/artjohan/cosmos-odyssey/backend/internal/pkg"
	"github.com/artjohan/cosmos-odyssey/backend/internal/pricelists"
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

func GetRoutes(db *sql.DB, origin, destination string) models.SearchResponse {
	var searchResp models.SearchResponse
	
	searchResp.RouteData = allRoutesInfo(db, origin, destination)
	searchResp.PricelistID, searchResp.PricelistExpiryDate = pricelists.CurrentPricelistIDAndExpirationDate(db)

	return searchResp
}

func allRoutesInfo(db *sql.DB, origin, destination string) []models.RouteData {
	legs := findAllLegs(db, origin, destination)
	var allRoutes = []models.RouteData{}

	for _, leg := range legs {
		layoverRoutes := layoverRoutes(queryRouteData(db), leg)
		for _, layoverRoute := range layoverRoutes {
			var route models.RouteData

			route.Routes = layoverRoute
			route.TotalPrice = pkg.RoundToTwoDecimals(pkg.CalculateRoutePrice(layoverRoute))
			route.TotalTravelTime = pkg.CalculateTravelTime(layoverRoute[0].FlightStart, layoverRoute[len(layoverRoute)-1].FlightEnd)
			route.TotalDistance = pkg.CalculateRouteDistance(layoverRoute)

			allRoutes = append(allRoutes, route)
		}
	}

	return allRoutes
}

func queryRouteData(db *sql.DB) []models.Route {
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
			pr.leg_id,
			pr.id,
			pr.price,
			pr.flight_start,
			pr.flight_end,
			l.distance
		FROM legs AS l
		JOIN planets AS p1 ON l.origin_id = p1.id
		JOIN planets AS p2 ON l.destination_id = p2.id
		JOIN providers AS pr ON l.id = pr.leg_id
		JOIN companies AS c ON pr.company_id = c.id
		JOIN LatestPricelist AS lp ON l.pricelist_id = lp.id
	`
	rows, err := db.Query(query)
	if err != nil {
		log.Fatal(err)
	}
	defer rows.Close()

	var routesData []models.Route
	for rows.Next() {
		var routeData models.Route
		if err := rows.Scan(&routeData.Origin.ID, &routeData.Origin.Name, &routeData.Destination.ID, &routeData.Destination.Name,
			&routeData.Company.ID, &routeData.Company.Name, &routeData.LegID, &routeData.ID, &routeData.Price, &routeData.FlightStart, &routeData.FlightEnd, &routeData.Distance); err != nil {
			log.Fatal(err)
		}

		// Calculate TravelTime
		routeData.TravelTime = pkg.CalculateTravelTime(routeData.FlightStart, routeData.FlightEnd)

		routesData = append(routesData, routeData)
	}

	return routesData
}
