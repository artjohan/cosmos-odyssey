CREATE TABLE IF NOT EXISTS reservations (
    id TEXT PRIMARY KEY,
    pricelistId TEXT NOT NULL,
    firstName TEXT NOT NULL,
    lastName TEXT NOT NULL,
    totalPrice REAL NOT NULL,
    totalTravelTime TEXT NOT NULL,
    FOREIGN KEY (pricelistId) REFERENCES pricelists (id) ON DELETE CASCADE
);