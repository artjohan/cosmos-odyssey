import React, { useEffect, useState } from "react";
import MaterialTable from "material-table";
import { ThemeProvider, createTheme } from "@mui/material";
import { formatDate, formatDuration } from "../utils/UtilFunctions";
import RouteDetailsPopup from "../utils/RouteDetailsPopup";

function Reservations() {
    const [reservations, setReservations] = useState(null);
    const defaultMaterialTheme = createTheme();

    const [selectedRow, setSelectedRow] = useState(null);
    const [showDetails, setShowDetails] = useState(false);

    const handleRowClick = (event, rowData) => {
        setSelectedRow(rowData);
        setShowDetails(true);
    };

    const displayProviders = (rowData) => {
        var providersMap = new Map();
        rowData.routes.forEach((route) => {
            providersMap.set(route.providerCompany.id, route.providerCompany);
        });

        var uniqueProviders = Array.from(providersMap.values());

        return uniqueProviders.map((element) => element.name).join(",\n");
    };

    useEffect(() => {
        const getReservations = async () => {
            try {
                const response = await fetch(
                    `http://localhost:8080/get-reservations`
                );
                if (response.ok) {
                    const data = await response.json();
                    setReservations(data);
                } else {
                    console.log(response.statusText);
                }
            } catch (error) {
                console.error(error);
            }
        };
        getReservations();
    }, []);

    if (Array.isArray(reservations)) {
        return reservations.length > 0 ? (
            <div style={{ width: "100%", height: "100%" }}>
                <ThemeProvider theme={defaultMaterialTheme}>
                    <MaterialTable
                        columns={[
                            { title: "First name", field: "firstName" },
                            { title: "Last name", field: "lastName" },
                            {
                                title: "Trip start",
                                render: (rowData) => {
                                    if(rowData.routes.length > 0) {
                                        const firstTrip = rowData.routes[0];
                                        return `${firstTrip.origin.name},\n${formatDate(firstTrip.flightStart)}`;
                                    }
                                    return "";
                                },
                                cellStyle: {
                                    whiteSpace: "pre-line",
                                },
                                type: "datetime",
                                customSort: (a, b) =>
                                    new Date(a.routes[0].flightStart) -
                                    new Date(b.routes[0].flightStart),
                                searchable: false,
                            },
                            {
                                title: "Trip end",
                                render: (rowData) => {
                                    if(rowData.routes.length > 0) {
                                        const finalTrip = rowData.routes[rowData.routes.length - 1];
                                        return `${finalTrip.destination.name},\n ${formatDate(finalTrip.flightEnd)}`;
                                    }
                                    return "";
                                },
                                cellStyle: {
                                    whiteSpace: "pre-line",
                                },
                                type: "datetime",
                                customSort: (a, b) =>
                                    new Date(
                                        a.routes[a.routes.length - 1].flightEnd
                                    ) -
                                    new Date(
                                        b.routes[b.routes.length - 1].flightEnd
                                    ),
                                searchable: false,
                            },
                            {
                                title: "Travel time",
                                field: "totalTravelTime",
                                render: (rowData) =>
                                    formatDuration(rowData.totalTravelTime),
                                searchable: false,
                            },
                            {
                                title: "Price",
                                field: "totalPrice",
                                type: "numeric",
                                searchable: false,
                            },
                            {
                                title: "Layovers",
                                render: (rowData) => rowData.routes.length,
                                type: "numeric",
                                customSort: (a, b) =>
                                    a.routes.length - b.routes.length,
                                searchable: false,
                            },
                            {
                                title: `Providers`,
                                render: (rowData) => displayProviders(rowData),
                                type: "numeric",
                                cellStyle: {
                                    whiteSpace: "pre-line",
                                },
                                sorting: false,
                                searchable: false,
                            },
                            {
                                title: "Refreshes until expiry",
                                field: "refreshesUntilExpiry",
                                type: "numeric",
                                searchable: false,
                            },
                        ]}
                        data={reservations}
                        options={{
                            pageSize: 20,
                            emptyRowsWhenPaging: false,
                            sorting: true,
                        }}
                        localization={{
                            toolbar: {
                                searchPlaceholder: "Search by name",
                            },
                        }}
                        onRowClick={handleRowClick}
                        title={"All reservations"}
                        style={{
                            "& tbody tr:hover": {
                                backgroundColor: "rgba(0, 0, 0, 0.04)",
                            },
                        }}
                    />
                </ThemeProvider>
                {selectedRow && (
                    <RouteDetailsPopup
                        routes={selectedRow.routes}
                        totalPrice={selectedRow.totalPrice}
                        totalTravelTime={selectedRow.totalTravelTime}
                        show={showDetails}
                        pricelistId={selectedRow.pricelistId}
                        title={`${selectedRow.firstName} ${selectedRow.lastName}'s reservation details`}
                        onClose={() => setShowDetails(false)}
                    />
                )}
            </div>
        ) : (
            <div
                style={{
                    textAlign: "center",
                    padding: "50px",
                    fontSize: "xx-large",
                }}
            >
                There are no active reservations
            </div>
        );
    }
}

export default Reservations;
