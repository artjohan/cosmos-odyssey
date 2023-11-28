CREATE TABLE IF NOT EXISTS legs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    uuid TEXT NOT NULL,
    pricelist_id TEXT NOT NULL,
    origin_id TEXT NOT NULL,
    destination_id TEXT NOT NULL,
    distance INT NOT NULL,
    FOREIGN KEY (pricelist_id) REFERENCES pricelists (id) ON DELETE CASCADE,
    FOREIGN KEY (origin_id) REFERENCES planets (id) ON DELETE CASCADE,
    FOREIGN KEY (destination_id) REFERENCES planets (id) ON DELETE CASCADE
);