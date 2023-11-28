import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function SearchResults() {
    const { origin, destination } = useParams();
    const [directRoutes, setDirectRoutes] = useState([]);
    const [layoverRoutes, setLayoverRoutes] = useState([]);
    const [pricelistExpiration, setPricelistExpiration] = useState(null);

    useEffect(() => {
        const getRoutes = async () => {
            try {
                const response = await fetch(
                    `http://localhost:8080/get-routes?origin=${origin}&destination=${destination}`
                );
                if (response.ok) {
                    const data = await response.json();
                    console.log(data)
                    setDirectRoutes(data.directRoutes);
                    setLayoverRoutes(data.layoverRoutes);
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

    return (
        <div>
            searching for {origin} to {destination}
        </div>
    );
}

export default SearchResults;
