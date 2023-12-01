import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { formatDuration } from "./UtilFunctions";

function ReservationForm({
    onClose,
    totalTravelTime,
    totalPrice,
    pricelistId,
    routes,
    setSnackbarOpen,
}) {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault();
        if (firstName.trim() && lastName.trim()) {
            setSnackbarOpen(true);
            postReservationData();
        } else {
            alert("Can't submit an incomplete form");
        }
    };

    const postReservationData = async () => {
        const payload = {
            pricelistId,
            routes,
            firstName,
            lastName,
            totalPrice,
            totalTravelTime,
        };

        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        };

        try {
            const response = await fetch(
                "http://localhost:8080/post-reservation",
                options
            );
            if (response.ok) {
                setSnackbarOpen(true);
                onClose();
            } else {
                const statusMsg = await response.text();
                console.error(statusMsg);
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Form style={{ padding: "20px" }} onSubmit={handleSubmit}>
            <div className="d-flex justify-content-between">
                <Form.Group className="mb-3 p-1">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                </Form.Group>
                <Form.Group className="mb-3 p-1">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                </Form.Group>
            </div>
            <div className="d-flex justify-content-between w-100">
                <Button variant="secondary" onClick={onClose}>
                    Close
                </Button>
                <div>
                    <strong>Total travel time:</strong>{" "}
                    {formatDuration(totalTravelTime)}
                    <br></br>
                    <strong>Total price:</strong> {totalPrice}
                </div>
                <Button
                    variant="success"
                    type="submit"
                    disabled={
                        firstName.trim() && lastName.trim() ? false : true
                    }
                >
                    Reserve now
                </Button>
            </div>
        </Form>
    );
}

export default ReservationForm;
