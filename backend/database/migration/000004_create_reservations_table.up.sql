CREATE TABLE IF NOT EXISTS reservations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    uuid TEXT NOT NULL,
    pricelist_id TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    total_price REAL NOT NULL,
    total_travel_time TEXT NOT NULL,
    FOREIGN KEY (pricelist_id) REFERENCES pricelists (id) ON DELETE CASCADE
);