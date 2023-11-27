CREATE TABLE IF NOT EXISTS routes (
    reservationId TEXT NOT NULL,
    providerId TEXT NOT NULL,
    FOREIGN KEY (reservationId) REFERENCES reservations (id) ON DELETE CASCADE,
    FOREIGN KEY (providerId) REFERENCES providers (id) ON DELETE CASCADE
);