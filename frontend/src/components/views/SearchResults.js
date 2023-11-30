import { useEffect, useState } from "react";
import { Route, useParams } from "react-router-dom";
import RouteTable from "../utils/RouteTable";

function SearchResults() {
    const { origin, destination } = useParams();
    const [directRoutes, setDirectRoutes] = useState([]);
    const [layoverRoutes, setLayoverRoutes] = useState([]);
    const [pricelistExpiration, setPricelistExpiration] = useState(null);

    const toTitleCase = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    };

    useEffect(() => {
        const getRoutes = async () => {
            try {
                const response = await fetch(
                    `http://localhost:8080/get-routes?origin=${toTitleCase(
                        origin
                    )}&destination=${toTitleCase(destination)}`
                );
                if (response.ok) {
                    const data = await response.json();
                    console.log(data);
                    setDirectRoutes(
                        data.filter((obj) => obj.routes.length === 1)
                    );
                    setLayoverRoutes(
                        data.filter((obj) => obj.routes.length > 1)
                    );
                    setPricelistExpiration(data.pricelistExpiration);
                } else {
                    console.log(response.statusText);
                }
            } catch (error) {
                console.error(error);
            }
        };
        getRoutes();
    }, []);

    if (directRoutes.length > 0 || layoverRoutes.length > 0) {
        return (
            <div>
                {directRoutes.length > 0 && (
                    <RouteTable routes={directRoutes} type={"All direct routes"}></RouteTable>
                )}
                {layoverRoutes.length > 0 && (
                    <RouteTable routes={layoverRoutes} type={"All layover routes"}></RouteTable>
                )}
            </div>
        );
    } else {
        return null;
    }
}
export default SearchResults;
