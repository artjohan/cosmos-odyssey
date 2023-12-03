package models

import "time"

type RouteInfo struct {
	ID       string   `json:"id"`
	From     Location `json:"from"`
	To       Location `json:"to"`
	Distance int      `json:"distance"`
}

type Location struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}

type Provider struct {
	ID          string    `json:"id"`
	Company     Company   `json:"company"`
	Price       float64   `json:"price"`
	FlightStart time.Time `json:"flightStart"`
	FlightEnd   time.Time `json:"flightEnd"`
}

type Company struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}

type Leg struct {
	ID        string     `json:"id"`
	RouteInfo RouteInfo  `json:"routeInfo"`
	Providers []Provider `json:"providers"`
}

type Pricelist struct {
	ID         string    `json:"id"`
	ValidUntil time.Time `json:"validUntil"`
	Legs       []Leg     `json:"legs"`
}

type ReservationInfo struct {
	FirstName string `json:"firstName"`
	LastName string `json:"lastName"`
	Routes []Route `json:"routes"`
	TotalPrice float64 `json:"totalPrice"`
	TotalTravelTime time.Duration `json:"totalTravelTime"`
	PricelistID int `json:"pricelistId"`
	RefreshesUntilExpiry int `json:"refreshesUntilExpiry"`
}
