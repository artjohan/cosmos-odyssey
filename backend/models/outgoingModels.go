package models

import "time"

type Planet struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
}

type AllRoutes struct {
	DirectRoutes  []Route        `json:"directRoutes"`
	LayoverRoutes []LayoverRoute `json:"layoverRoutes"`
}

type LayoverRoute struct {
	Routes          []Route   `json:"routes"`
	TotalPrice      float64   `json:"totalPrice"`
	TotalTravelTime time.Time `json:"totalTravelTime"`
}

type Route struct {
	ID          int             `json:"id"`
	Origin      Planet          `json:"origin"`
	Destination Planet          `json:"destination"`
	Company     ProviderCompany `json:"providerCompany"`
	FlightStart time.Time       `json:"flightStart"`
	FlightEnd   time.Time       `json:"flightEnd"`
	Price       float64         `json:"price"`
	TravelTime  time.Time       `json:"travelTime"`
}

type RouteData struct {
	ID          int
	LegID       int
	FlightStart time.Time
	FlightEnd   time.Time
	Price       float64
}

type ProviderCompany struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
}

type AlgoLeg struct {
	ID          int
	Origin      Planet
	Destination Planet
}
