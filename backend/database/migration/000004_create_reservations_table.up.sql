CREATE TABLE IF NOT EXISTS reservations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pricelist_id INTEGER NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    total_price REAL NOT NULL,
    total_travel_time INTEGER NOT NULL,
    FOREIGN KEY (pricelist_id) REFERENCES pricelists (id) ON DELETE CASCADE
);