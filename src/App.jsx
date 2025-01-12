import { useState } from "react";
import Map from './components/Map';

export default function App() {
  const [cep, setCep] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");
  const [mapLoaded, setMapLoaded] = useState(false);

  async function fetchData() {
    try {
      if (inputValue.length !== 8 || isNaN(inputValue)) {
        setError("O CEP precisa ter 8 dígitos numéricos.");
        setCep("");
        setMapLoaded(false);
        return;
      }

      const response = await fetch(
        `https://viacep.com.br/ws/${inputValue}/json/`
      );
      if (!response.ok) {
        throw new Error("CEP não encontrado");
      }
      const data = await response.json();

      if (data.erro) {
        throw new Error(
          "CEP não encontrado, por favor verificar o CEP e tente novamente.."
        );
      }

      setCep(data);
      setError("");
      setMapLoaded(true);
    } catch (error) {
      setError(error.message);
      setCep("");
      setMapLoaded(false);
    }
  }

  return (
    <div className="container">
      <div className="container-search">
        <h1>Busca rápida de localização pelo CEP</h1>
        <input
          placeholder="Digite o CEP"
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        {error && <p className="msg-erro">{error}</p>}
        <button onClick={fetchData}>Buscar</button>
        {cep && (
          <div className="search-content">
            <ul>
              <li>
                <strong>Logradouro:</strong> {cep.logradouro}
              </li>
              <li>
                <strong>Bairro:</strong> {cep.bairro}
              </li>
              <li>
                <strong>Cidade:</strong> {cep.localidade}
              </li>
              <li>
                <strong>Estado:</strong> {cep.uf}
              </li>
              {cep.complemento && (
                <li>
                  <strong>Complemento:</strong> {cep.complemento}
                </li>
              )}
              <li>
                <strong>DDD:</strong> {cep.ddd}
              </li>
            </ul>
          </div>
        )}
      </div>
      <div className="map">
        {mapLoaded && (
          <Map address={`${cep.logradouro}, ${cep.localidade}, ${cep.uf}`} />
        )}
      </div>
    </div>
  );
}
