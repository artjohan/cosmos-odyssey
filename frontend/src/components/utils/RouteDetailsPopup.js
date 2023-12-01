import { Button, Modal } from "react-bootstrap";
import { formatDate, formatDuration } from "./UtilFunctions";
import ReservationForm from "./ReservationForm.js";

function RouteDetailsPopup({
    routes,
    totalPrice,
    totalTravelTime,
    pricelistId,
    show,
    onClose,
    setSnackbarOpen,
    title,
}) {
    if (routes) {
        return (
            <>
                <Modal show={show} onHide={onClose} centered>
                    <Modal.Header>
                        <Modal.Title>{title}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body
                        style={{ maxHeight: "50vh", overflowY: "auto" }}
                    >
                        {routes.map((route, index) => (
                            <div className="route-info-container">
                                {routes.length > 1 && (
                                    <h2
                                        style={{
                                            marginBottom: "20px",
                                            textAlign: "center",
                                        }}
                                    >
                                        Flight {index + 1}
                                    </h2>
                                )}

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
                        {title.includes("reservation") ? (
                            <div className="d-flex justify-content-between w-100">
                                <div>
                                    <strong>Total travel time:</strong>{" "}
                                    {formatDuration(totalTravelTime)}
                                    <br></br>
                                    <strong>Total price:</strong> {totalPrice}
                                </div>
                                <Button variant="secondary" onClick={onClose}>
                                    Close
                                </Button>
                            </div>
                        ) : (
                            <ReservationForm
                                onClose={onClose}
                                totalTravelTime={totalTravelTime}
                                totalPrice={totalPrice}
                                pricelistId={pricelistId}
                                routes={routes}
                                setSnackbarOpen={setSnackbarOpen}
                            ></ReservationForm>
                        )}
                    </Modal.Footer>
                </Modal>
            </>
        );
    }
}

export default RouteDetailsPopup;
