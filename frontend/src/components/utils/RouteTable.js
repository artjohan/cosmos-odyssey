import React, { useEffect, useState } from "react";
import MaterialTable from "material-table";
import {
    MenuItem,
    Select,
    ThemeProvider,
    createTheme,
    Snackbar,
} from "@mui/material";
import RouteDetailsPopup from "./RouteDetailsPopup";
import { formatDate, formatDuration } from "./UtilFunctions";

function RouteTable({ routes, type, uniqueProviders, pricelistId }) {
    const defaultMaterialTheme = createTheme();
    const [selectedOption, setSelectedOption] = useState("");
    const isLayoverType = type.toLowerCase().includes("layover");

    const [selectedRow, setSelectedRow] = useState(null);
    const [showDetails, setShowDetails] = useState(false);

    const [tableData, setTableData] = useState(routes);

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const handleClose = (reason) => {
        if (reason === "clickaway") {
            return;
        }

        setSnackbarOpen(false);
    };

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
        const filteredData =
            selectedOption === ""
                ? routes
                : routes.filter((route) =>
                      route.routes.some(
                          (r) => r.providerCompany.name === selectedOption
                      )
                  );

        setTableData(filteredData);
    }, [selectedOption, routes]);

    return (
        <div style={{ width: "100%", height: "100%" }}>
            <ThemeProvider theme={defaultMaterialTheme}>
                <MaterialTable
                    columns={[
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
                                    ? formatDate(rowData.routes[0].flightStart)
                                    : "";
                            },
                            type: "datetime",
                            customSort: (a, b) =>
                                new Date(a.routes[0].flightStart) -
                                new Date(b.routes[0].flightStart),
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
                        },
                        {
                            title: "Trip duration",
                            field: "totalTravelTime",
                            render: (rowData) =>
                                formatDuration(rowData.totalTravelTime),
                        },
                        {
                            title: "Total distance (km)",
                            field: "totalDistance",
                            type: "numeric",
                        },
                        {
                            title: "Price",
                            field: "totalPrice",
                            type: "numeric",
                        },
                        {
                            title: "Layovers",
                            render: (rowData) => rowData.routes.length,
                            type: "numeric",
                            customSort: (a, b) =>
                                a.routes.length - b.routes.length,
                        },
                        {
                            title: `Provider${isLayoverType ? "s" : ""}`,
                            render: (rowData) => displayProviders(rowData),
                            type: "numeric",
                            cellStyle: {
                                whiteSpace: "pre-line",
                            },
                            sorting: false,
                        },
                    ]}
                    data={tableData}
                    options={{
                        pageSize: 20,
                        emptyRowsWhenPaging: false,
                        sorting: true,
                    }}
                    localization={{
                        toolbar: {
                            searchPlaceholder: "Search for providers",
                        },
                    }}
                    components={{
                        Toolbar: () => (
                            <div>
                                <Select
                                    style={{ width: "200px", margin: "10px" }}
                                    value={selectedOption}
                                    onChange={(event) =>
                                        setSelectedOption(event.target.value)
                                    }
                                    displayEmpty
                                    renderValue={(value) =>
                                        value === "" ? "Select provider" : value
                                    }
                                >
                                    <MenuItem value="">All providers</MenuItem>
                                    {uniqueProviders.map((provider) => (
                                        <MenuItem
                                            key={provider.id}
                                            value={provider.name}
                                        >
                                            {provider.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </div>
                        ),
                    }}
                    onRowClick={handleRowClick}
                    title={type}
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
                    pricelistId={pricelistId}
                    show={showDetails}
                    onClose={() => setShowDetails(false)}
                    setSnackbarOpen={setSnackbarOpen}
                />
            )}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={handleClose}
                message="Booking successful!"
            />
        </div>
    );
}

export default RouteTable;
