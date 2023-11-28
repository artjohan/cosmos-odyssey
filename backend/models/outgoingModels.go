package models

type Planet struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
}

type Route struct {
	Origin      Planet `json:"origin"`
	Destination Planet `json:"destination"`
}
