CREATE TABLE IF NOT EXISTS legs (
    id TEXT PRIMARY KEY,
    pricelistId TEXT NOT NULL,
    originPlanet TEXT NOT NULL,
    destinationPlanet TEXT NOT NULL,
    distance INT NOT NULL,
    FOREIGN KEY (pricelistId) REFERENCES pricelists (id) ON DELETE CASCADE
);