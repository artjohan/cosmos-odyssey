import React from "react";
import ReactDOM from "react-dom/client";
import "./styles.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import App from "./App";
import ErrorPage from "./components/views/ErrorPage";
import Home from "./components/views/Home";
import SearchResults from "./components/views/SearchResults";
import Reservations from "./components/views/Reservations";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        errorElement: <ErrorPage />,
        children: [
            { index: true, element: <Home /> },
            {
                path: "/search/:origin/:destination",
                element: <SearchResults />,
            },
            {
                path: "/reservations",
                element: <Reservations />,
            },
        ],
    },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);
