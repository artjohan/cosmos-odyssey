import { Button, Modal } from "react-bootstrap";
import { formatDate, formatDuration } from "./UtilFunctions";

function RouteDetailsPopup({
    routes,
    totalPrice,
    totalTravelTime,
    pricelistId,
    show,
    onClose,
}) {
    if (routes) {
        return (
            <Modal show={show} onHide={onClose} centered>
                <Modal.Header>
                    <Modal.Title>Route{routes.length > 1 ? "s" : ""}:</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ maxHeight: "50vh", overflowY: "auto" }}>
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
                                <strong>Distance:</strong> {route.distance} km
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
                    <div className="d-flex justify-content-between w-100">
                        <Button variant="secondary" onClick={onClose}>
                            Close
                        </Button>
                        <div>
                            <strong>Total price:</strong> {totalPrice}
                        </div>
                        <Button variant="success">Book now</Button>
                    </div>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default RouteDetailsPopup;
