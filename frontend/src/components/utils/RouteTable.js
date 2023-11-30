import React, { useState } from "react";
import MaterialTable from "material-table";
import { ThemeProvider, createTheme } from "@mui/material";

function RouteTable({ routes, type }) {
    const defaultMaterialTheme = createTheme();
    const [hoveredRow, setHoveredRow] = useState(null);

    const isLayoverType = type.toLowerCase().includes("layover");

    const handleRowClick = (event, rowData) => {
        console.log("Row clicked:", rowData);
    };

    const handleRowHover = (event, rowData) => {
        setHoveredRow(rowData.tableData.id);
    };

    const handleRowLeave = () => {
        setHoveredRow(null);
    };

    const displayProviders = (rowData) => {
        if (!isLayoverType) {
            return rowData.routes[0].providerCompany.name;
        }

        var providersMap = new Map();
        rowData.routes.forEach((route) => {
            providersMap.set(route.providerCompany.id, route.providerCompany);
        });

        var uniqueProviders = Array.from(providersMap.values());
        console.log(uniqueProviders);
        return uniqueProviders.length;
    };

    const formatDuration = (nanoseconds) => {
        const seconds = nanoseconds / 1e9;
        const days = Math.floor(seconds / 86400);
        const hours = Math.floor((seconds % 86400) / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);

        let durationString = "";

        if (days > 0) {
            durationString += `${days}d `;
        }

        if (hours > 0 || days > 0) {
            durationString += `${hours}h `;
        }

        durationString += `${minutes}m`;

        return durationString.trim();
    };

    return (
        <div style={{ width: "100%", height: "100%" }}>
            <ThemeProvider theme={defaultMaterialTheme}>
                <MaterialTable
                    columns={[
                        {
                            title: "Trip start",
                            render: (rowData) =>
                                rowData.routes.length > 0
                                    ? new Date(
                                          rowData.routes[0].flightStart
                                      ).toLocaleString()
                                    : "",
                            type: "datetime",
                            customSort: (a, b) =>
                                new Date(a.routes[0].flightStart) -
                                new Date(b.routes[0].flightStart),
                        },
                        {
                            title: "Trip end",
                            render: (rowData) =>
                                rowData.routes.length > 0
                                    ? new Date(
                                          rowData.routes[
                                              rowData.routes.length - 1
                                          ].flightEnd
                                      ).toLocaleString()
                                    : "",
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
                            customSort: (a, b) =>
                                a.routes.length - b.routes.length,
                        },
                    ]}
                    data={routes}
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
                    onRowClick={handleRowClick}
                    onRowMouseOver={handleRowHover}
                    onRowMouseLeave={handleRowLeave}
                    title={type}
                    style={{
                        "& tbody tr:hover": {
                            backgroundColor: "rgba(0, 0, 0, 0.04)", // Set your hover background color here
                        },
                    }}
                />
            </ThemeProvider>
        </div>
    );
}

export default RouteTable;
