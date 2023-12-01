import React, { useEffect, useState } from "react";
import MaterialTable from "material-table";
import { MenuItem, Select, ThemeProvider, createTheme } from "@mui/material";
import { formatDate, formatDuration } from "../utils/UtilFunctions";
import RouteDetailsPopup from "../utils/RouteDetailsPopup";

function Reservations() {
    const [reservations, setReservations] = useState(null);
    const defaultMaterialTheme = createTheme();

    const handleRowClick = (event, rowData) => {
        setSelectedRow(rowData);
        setShowDetails(true);
    };

    const [selectedRow, setSelectedRow] = useState(null);
    const [showDetails, setShowDetails] = useState(false);

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
                    console.log(data);
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
        return (
            <div style={{ width: "100%", height: "100%" }}>
                <ThemeProvider theme={defaultMaterialTheme}>
                    <MaterialTable
                        columns={[
                            { title: "First Name", field: "firstName" },
                            { title: "Last Name", field: "lastName" },
                            {
                                title: "Trip start",
                                render: (rowData) => {
                                    const options = {
                                        year: "numeric",
                                        month: "2-digit",
                                        day: "2-digit",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    };
                                    return rowData.routes.length > 0
                                        ? formatDate(
                                              rowData.routes[0].flightStart
                                          )
                                        : "";
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
                                    const options = {
                                        year: "numeric",
                                        month: "2-digit",
                                        day: "2-digit",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    };
                                    return rowData.routes.length > 0
                                        ? formatDate(
                                              rowData.routes[
                                                  rowData.routes.length - 1
                                              ].flightEnd
                                          )
                                        : "";
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
                        ]}
                        data={reservations}
                        options={{
                            pageSize: 20,
                            emptyRowsWhenPaging: false,
                            sorting: true,
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
        );
    }
}

export default Reservations;