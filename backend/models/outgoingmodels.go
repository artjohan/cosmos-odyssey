package models

import "time"

type Planet struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
}

type SearchResponse struct {
	RouteData           []RouteData `json:"routeData"`
	PricelistID         int         `json:"pricelistId"`
	PricelistExpiryDate time.Time   `json:"pricelistExpiryDate"`
}

type RouteData struct {
	Routes          []Route       `json:"routes"`
	TotalPrice      float64       `json:"totalPrice"`
	TotalTravelTime time.Duration `json:"totalTravelTime"`
	TotalDistance   int           `json:"totalDistance"`
}

type Route struct {
	ID          int             `json:"id"`
	LegID       int             `json:"legId"`
	Origin      Planet          `json:"origin"`
	Destination Planet          `json:"destination"`
	Company     ProviderCompany `json:"providerCompany"`
	FlightStart time.Time       `json:"flightStart"`
	FlightEnd   time.Time       `json:"flightEnd"`
	Price       float64         `json:"price"`
	TravelTime  time.Duration   `json:"travelTime"`
	Distance    int             `json:"distance"`
}

type ProviderCompany struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
}
