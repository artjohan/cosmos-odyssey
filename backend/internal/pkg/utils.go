package pkg

import (
	"time"

	"github.com/artjohan/cosmos-odyssey/backend/models"
)

func CalculateRoutePrice(route []models.Route) float64 {
	totalPrice := 0.0
	for _, v := range route {
		totalPrice += v.Price
	}

	return totalPrice
}

func RoundToTwoDecimals(value float64) float64 {
	return float64(int(value*100+0.5)) / 100
}

func CalculateTravelTime(start, end time.Time) time.Duration {
	layout := "2006-01-02 15:04:05"
	startTime, _ := time.Parse(layout, start.Format(layout))
	endTime, _ := time.Parse(layout, end.Format(layout))

	travelTime := endTime.Sub(startTime)
	return travelTime
}

func CalculateRouteDistance(route []models.Route) int {
	totalDistance := 0
	for _, v := range route {
		totalDistance += v.Distance
	}

	return totalDistance
}
