import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { GoogleMap, useJsApiLoader, MarkerF } from "@react-google-maps/api";
import style from "./map.module.css";
Map.propTypes = {
  address: PropTypes.string.isRequired,
};

export default function Map({ address }) {
  const [location, setLocation] = useState("");
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyCUoPixHfLSLpuzGY2EWMTpNdZiNgAR_E8",
  });

  useEffect(() => {
    async function fetchGeocode() {
      try {
        const geocodeResponse = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
            address
          )}&key=AIzaSyCUoPixHfLSLpuzGY2EWMTpNdZiNgAR_E8`
        );
        const geocodeData = await geocodeResponse.json();

        console.log("Resposta da API de Geocodificação:", geocodeData);

        if (geocodeData.results.length > 0) {
          const { lat, lng } = geocodeData.results[0].geometry.location;
          setLocation({ lat, lng });
        } else {
          throw new Error("Não foi possível obter a localização.");
        }
      } catch (error) {
        console.error("Erro ao buscar a geolocalização:", error);
      }
    }

    if (address) {
      fetchGeocode();
    }
  }, [address]);

  return (
    <div className={style.map}>
      {isLoaded && location ? (
        <GoogleMap
          mapContainerStyle={{ width: "100%", height: "100%" }}
          center={location}
          zoom={17}
        >
          <MarkerF position={location} />
        </GoogleMap>
      ) : (
        <p>Carregando mapa...</p>
      )}
    </div>
  );
}
