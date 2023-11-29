package main

import (
	"context"
	"database/sql"
	"log"
	"net/http"
	"os"
	"os/signal"
	"time"

	"github.com/artjohan/cosmos-odyssey/backend/database"
	"github.com/artjohan/cosmos-odyssey/backend/internal/pricelists"
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

	pricelists.UpdatePricelists(app.db)

	// main goroutine context to allow for a graceful shutdown
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	// channel to receive termination signals
	signalChannel := make(chan os.Signal, 1)
	signal.Notify(signalChannel, os.Interrupt)

	// goroutine for regularly fetching new pricelists and adding them to the table
	go func() {
		for {
			remainingTime, err := pricelists.GetCurrentPricelistExpirationTime(app.db)
			if err != nil {
				log.Println("Error getting pricelist expiration time:", err)
			}

			log.Println("Time until next pricelist update:", remainingTime)

			select {
			case <-time.After(remainingTime):
				pricelists.UpdatePricelists(app.db)
				log.Println("Pricelist updated")
			case <-ctx.Done():
				log.Println("Shutting down gracefully...")
				return
			}
		}
	}()

	server := &http.Server{
		Addr:    ":8080",
		Handler: app.server(),
	}

	go func() {
		log.Println("Started go API server at http://localhost:8080/")
		err := server.ListenAndServe()
		if err != nil && err != http.ErrServerClosed {
			log.Fatal(err)
		}
	}()

	<-signalChannel

	// attempting graceful shutdown of goroutines and http server
	cancel()
	timeoutCtx, timeoutCancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer timeoutCancel()

	if err := server.Shutdown(timeoutCtx); err != nil {
		log.Println("Error during server shutdown:", err)
	}
	log.Println("Server shut down gracefully")
}
