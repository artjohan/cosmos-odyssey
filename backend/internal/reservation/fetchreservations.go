package reservation

import (
	"database/sql"
	"log"

	"github.com/artjohan/cosmos-odyssey/backend/internal/pkg"
	"github.com/artjohan/cosmos-odyssey/backend/models"
)

func FetchReservations(db *sql.DB) []models.ReservationInfo {
	var reservationsInfo = queryReservationsInfo(db)

	return reservationsInfo
}

func queryReservationsInfo(db *sql.DB) []models.ReservationInfo {
	query := `
		SELECT
			r.id,
			r.first_name,
			r.last_name,
			r.total_price,
			r.total_travel_time,
			p_positions.position,
			p_positions.total_rows
		FROM reservations AS r
		JOIN (
			SELECT
				id,
				ROW_NUMBER() OVER (ORDER BY id) AS position,
				COUNT(*) OVER () AS total_rows
			FROM pricelists AS p
		) p_positions ON r.pricelist_id = p_positions.id
	`

	rows, err := db.Query(query)
	if err != nil {
		log.Fatal("Error querying database for reservation info", err)
	}
	defer rows.Close()

	var reservationsInfo = []models.ReservationInfo{}
	for rows.Next() {
		var reservationInfo models.ReservationInfo
		var reservationId int

		var pricelistPos, totalPriceListAmount int
		if err := rows.Scan(&reservationId, &reservationInfo.FirstName, &reservationInfo.LastName, &reservationInfo.TotalPrice, &reservationInfo.TotalTravelTime, &pricelistPos, &totalPriceListAmount); err != nil {
			log.Fatal("Error scanning reservation data into struct", err)
		}

		// calculating how many refreshes left until reservation expires
		reservationInfo.RefreshesUntilExpiry = (15-totalPriceListAmount+pricelistPos)

		reservationInfo.Routes = queryReservationRoutesInfo(db, reservationId)

		reservationsInfo = append(reservationsInfo, reservationInfo)
	}

	return reservationsInfo
}

func queryReservationRoutesInfo(db *sql.DB, reservationId int) []models.Route {
	query := `
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
		FROM routes AS r
		JOIN providers AS pr ON pr.id = r.provider_id
		JOIN legs AS l ON l.id = pr.leg_id
		JOIN planets AS p1 ON l.origin_id = p1.id
		JOIN planets AS p2 ON l.destination_id = p2.id
		JOIN companies AS c ON pr.company_id = c.id
		WHERE r.reservation_id = ?
	`

	rows, err := db.Query(query, reservationId)
	if err != nil {
		log.Fatal("Error querying database for reservations route data", err)
	}
	defer rows.Close()

	var routesData []models.Route
	for rows.Next() {
		var routeData models.Route
		if err := rows.Scan(&routeData.Origin.ID, &routeData.Origin.Name, &routeData.Destination.ID, &routeData.Destination.Name,
			&routeData.Company.ID, &routeData.Company.Name, &routeData.LegID, &routeData.ID, &routeData.Price, &routeData.FlightStart, &routeData.FlightEnd, &routeData.Distance); err != nil {
			log.Fatal("Error scanning route data into struct", err)
		}

		routeData.TravelTime = pkg.CalculateTravelTime(routeData.FlightStart, routeData.FlightEnd)

		routesData = append(routesData, routeData)
	}

	return routesData
}
