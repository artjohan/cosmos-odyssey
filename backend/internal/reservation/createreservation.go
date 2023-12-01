package reservation

import (
	"database/sql"
	"log"

	"github.com/artjohan/cosmos-odyssey/backend/models"
)

func CreateReservation(db *sql.DB, reservationInfo models.ReservationInfo) error {
	tx, err := db.Begin()
	if err != nil {
		log.Println("Error starting transaction:", err)
		return err
	}
	defer func() {
		if err != nil {
			if rollbackErr := tx.Rollback(); rollbackErr != nil {
				log.Println("Error rolling back transaction:", rollbackErr)
				return
			}
		}
	}()

	err = addReservationToTable(tx, reservationInfo)
	if err != nil {
		log.Println("Error adding reservation to table:", err)
		return err
	}

	err = tx.Commit()
	if err != nil {
		log.Println("Error committing transaction:", err)
		return err
	}

	return nil
}

func addReservationToTable(tx *sql.Tx, reservationInfo models.ReservationInfo) error {
	statement := `INSERT INTO reservations (pricelist_id, first_name, last_name, total_price, total_travel_time) values (?, ?, ?, ?, ?)`
	result, err := tx.Exec(statement, reservationInfo.PricelistID, reservationInfo.FirstName, reservationInfo.LastName, reservationInfo.TotalPrice, reservationInfo.TotalTravelTime)
	if err != nil {
		log.Println("Error inserting reservation into table:", err)
		return err
	}

	reservationId, err := result.LastInsertId()
	if err != nil {
		log.Println("Error getting reservation ID:", err)
		return err
	}

	err = addRoutesToTable(tx, reservationInfo.Routes, int(reservationId))
	if err != nil {
		log.Println("Error inserting reservation routes into table:", err)
		return err
	}

	return nil
}

func addRoutesToTable(tx *sql.Tx, routes []models.Route, reservationId int) error {
	for _, route := range routes {
		statement := `INSERT INTO routes (reservation_id, provider_id) values (?, ?)`
		_, err := tx.Exec(statement, reservationId, route.ID)
		if err != nil {
			log.Println("Error inserting reservation into table:", err)
			return err
		}
	}
	return nil
}
