package routing

import "github.com/artjohan/cosmos-odyssey/backend/models"

func layoverRoutes(routeData []models.Route, legIDs []int) [][]models.Route {
	var layoverRoutes [][]models.Route
	visited := make(map[int]bool)
	currentRoute := []models.Route{}

	findAllLayoverRoutes(routeData, legIDs, visited, currentRoute, &layoverRoutes)

	return layoverRoutes
}

func findAllLayoverRoutes(routeData []models.Route, legIDs []int, visited map[int]bool, currentRoute []models.Route, layoverRoutes *[][]models.Route) {
	if len(currentRoute) == len(legIDs) {
		*layoverRoutes = append(*layoverRoutes, append([]models.Route(nil), currentRoute...))
		return
	}

	for legIndex, legID := range legIDs {
		if !visited[legID] {
			visited[legID] = true

			providers := filterProvidersByLeg(routeData, legID)
			for _, provider := range providers {
				if isValidLayover(routeData, currentRoute, provider) && legIndex == len(currentRoute) {
					findAllLayoverRoutes(routeData, legIDs, visited, append(currentRoute, provider), layoverRoutes)
				}
			}
			visited[legID] = false
		}
	}
}

func isValidLayover(route, currentRoute []models.Route, provider models.Route) bool {
	if len(currentRoute) > 0 {
		lastLeg := currentRoute[len(currentRoute)-1]
		return lastLeg.FlightEnd.Before(provider.FlightStart)
	}
	return true
}

func filterProvidersByLeg(providers []models.Route, legId int) []models.Route {
	var filteredProviders []models.Route
	for _, provider := range providers {
		if provider.LegID == legId {
			filteredProviders = append(filteredProviders, provider)
		}
	}
	return filteredProviders
}
