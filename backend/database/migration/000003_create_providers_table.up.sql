CREATE TABLE IF NOT EXISTS providers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    uuid TEXT NOT NULL,
    leg_id INTEGER NOT NULL,
    company_id INTEGER NOT NULL,
    price REAL NOT NULL,
    flight_start DATE NOT NULL,
    flight_end DATE NOT NULL,
    FOREIGN KEY (leg_id) REFERENCES legs (id) ON DELETE CASCADE,
    FOREIGN KEY (company_id) REFERENCES companies (id) ON DELETE CASCADE
);