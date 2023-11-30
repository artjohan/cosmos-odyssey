import React, { useState } from "react";
import MaterialTable from "material-table";
import { ThemeProvider, createTheme } from "@mui/material";

function RouteTable({ routes, type }) {
    const defaultMaterialTheme = createTheme();

    const fixDate = (date) => {};

    console.log(routes);
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
                            customSort: (a, b) => new Date(a.startDate) - new Date(b.startDate),
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
                            customSort: (a, b) => new Date(a.startDate) - new Date(b.startDate),
                        },
                        {
                            title: "Trip duration",
                            field: "totalTravelTime",
                            type: "time",
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
                        },
                    ]}
                    data={routes}
                    options={{
                        pageSize: routes.length < 20 ? routes.length : 20,
                        sorting: true
                    }}
                    title={type}
                />
            </ThemeProvider>
        </div>
    );
}

export default RouteTable;
