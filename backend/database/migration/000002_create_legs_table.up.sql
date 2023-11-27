CREATE TABLE IF NOT EXISTS legs (
    id TEXT PRIMARY KEY,
    priceListId TEXT NOT NULL,
    originPlanet TEXT NOT NULL,
    destinationPlanet TEXT NOT NULL,
    distance INT NOT NULL,
    FOREIGN KEY (priceListId) REFERENCES priceLists (id) ON DELETE CASCADE
);