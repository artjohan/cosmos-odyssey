CREATE TABLE IF NOT EXISTS reservations (
    id TEXT PRIMARY KEY,
    priceListId TEXT NOT NULL,
    firstName TEXT NOT NULL,
    lastName TEXT NOT NULL,
    totalPrice REAL NOT NULL,
    totalTravelTime TEXT NOT NULL,
    FOREIGN KEY (priceListId) REFERENCES priceLists (id) ON DELETE CASCADE
);