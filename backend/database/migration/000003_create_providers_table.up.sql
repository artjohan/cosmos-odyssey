CREATE TABLE IF NOT EXISTS providers (
    id TEXT PRIMARY KEY,
    legId TEXT NOT NULL,
    companyId TEXT NOT NULL,
    companyName TEXT NOT NULL,
    price REAL NOT NULL,
    flightStart DATE NOT NULL,
    flightEnd DATE NOT NULL,
    FOREIGN KEY (legId) REFERENCES legs (id) ON DELETE CASCADE
);