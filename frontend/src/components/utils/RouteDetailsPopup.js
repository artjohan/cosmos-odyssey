import { Modal } from "react-bootstrap";
import { formatDate, formatDuration } from "./UtilFunctions";
import { useState } from "react";
import BookingForm from "./BookingForm.js";

function RouteDetailsPopup({
    routes,
    totalPrice,
    totalTravelTime,
    pricelistId,
    show,
    onClose,
    setSnackbarOpen,
}) {
    const [showBookingConfirmation, setShowBookingConfirmation] =
        useState(false);

    if (routes) {
        return (
            <>
                <Modal show={show} onHide={onClose} centered>
                    <Modal.Header>
                        <Modal.Title>
                            Route{routes.length > 1 ? "s" : ""}:
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body
                        style={{ maxHeight: "50vh", overflowY: "auto" }}
                    >
                        {routes.map((route) => (
                            <div className="route-info-container">
                                <div className="route-info-section">
                                    <strong>Origin:</strong> {route.origin.name}
                                </div>
                                <div className="route-info-section">
                                    <strong>Destination:</strong>{" "}
                                    {route.destination.name}
                                </div>
                                <div className="route-info-section">
                                    <strong>Departure:</strong>{" "}
                                    {formatDate(route.flightStart)}
                                </div>
                                <div className="route-info-section">
                                    <strong>Arrival:</strong>{" "}
                                    {formatDate(route.flightEnd)}
                                </div>
                                <div className="route-info-section">
                                    <strong>Price:</strong> {route.price}
                                </div>
                                <div className="route-info-section">
                                    <strong>Distance:</strong> {route.distance}{" "}
                                    km
                                </div>
                                <div className="route-info-section">
                                    <strong>Duration:</strong>{" "}
                                    {formatDuration(route.travelTime)}
                                </div>
                                <div className="route-info-section">
                                    <strong>Provider:</strong>{" "}
                                    {route.providerCompany.name}
                                </div>
                            </div>
                        ))}
                    </Modal.Body>
                    <Modal.Footer>
                        <BookingForm
                            onClose={onClose}
                            totalTravelTime={totalTravelTime}
                            totalPrice={totalPrice}
                            pricelistId={pricelistId}
                            routes={routes}
                            setSnackbarOpen={setSnackbarOpen}
                        ></BookingForm>
                    </Modal.Footer>
                </Modal>
            </>
        );
    }
}

export default RouteDetailsPopup;
