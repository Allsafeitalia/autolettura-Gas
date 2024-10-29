import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend } from 'chart.js';
import './App.css';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

function App() {
  const [matricola, setMatricola] = useState('');
  const [matricolaContatore, setMatricolaContatore] = useState('');
  const [letturaContatoreParte1, setLetturaContatoreParte1] = useState('');
  const [letturaContatoreParte2, setLetturaContatoreParte2] = useState('');
  const [pdr, setPdr] = useState('');
  const [dataLettura, setDataLettura] = useState(new Date().toISOString().slice(0, 10));
  const [storico, setStorico] = useState([]);

  useEffect(() => {
    // Load existing data from localStorage
    const storedData = localStorage.getItem('storicoLetture');
    if (storedData) {
      setStorico(JSON.parse(storedData));
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (matricola && letturaContatoreParte1.length === 5 && letturaContatoreParte2.length === 3 && pdr.length === 14) {
      const nuovaLettura = {
        matricola,
        matricolaContatore,
        letturaContatore: `${letturaContatoreParte1}${letturaContatoreParte2}`,
        pdr,
        data: dataLettura,
      };

      const updatedStorico = [...storico, nuovaLettura];
      setStorico(updatedStorico);

      // Save to localStorage
      localStorage.setItem('storicoLetture', JSON.stringify(updatedStorico));

      setMatricola('');
      setMatricolaContatore('');
      setLetturaContatoreParte1('');
      setLetturaContatoreParte2('');
      setPdr('');
      setDataLettura(new Date().toISOString().slice(0, 10));
    } else {
      alert('Compila tutti i campi obbligatori correttamente.');
    }
  };

  const handleDelete = (index) => {
    const updatedStorico = storico.filter((_, i) => i !== index);
    setStorico(updatedStorico);
    localStorage.setItem('storicoLetture', JSON.stringify(updatedStorico));
  };

  const datiGrafico = {
    labels: storico.map((entry) => entry.data),
    datasets: [
      {
        label: 'Lettura Contatore',
        data: storico.map((entry) => parseInt(entry.letturaContatore, 10)),
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.2)',
        fill: true,
      },
    ],
  };

  return (
    <div className="App">
      <div className="container">
        <div className="info-banner">Servizio attivo dal 26 Ottobre 2024 al 30 Ottobre 2024</div>
        <h1 className="title">Compila i seguenti campi per inviare l'autolettura:</h1>
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label>Matricola *</label>
            <input
              type="text"
              placeholder="Matricola Contatore"
              value={matricola}
              onChange={(e) => setMatricola(e.target.value)}
              required
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label>Lettura Contatore *</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                type="number"
                placeholder="00000"
                value={letturaContatoreParte1}
                onChange={(e) => setLetturaContatoreParte1(e.target.value)}
                required
                maxLength="5"
                className="form-control"
              />
              <input
                type="number"
                placeholder="000"
                value={letturaContatoreParte2}
                onChange={(e) => setLetturaContatoreParte2(e.target.value)}
                required
                maxLength="3"
                className="form-control form-control-red"
              />
            </div>
          </div>
          <div className="form-group">
            <label>PDR *</label>
            <input
              type="text"
              placeholder="Composto da 14 numeri"
              value={pdr}
              onChange={(e) => setPdr(e.target.value)}
              required
              maxLength="14"
              className="form-control"
            />
          </div>
          <button type="submit" className="btn btn-primary">Invia Lettura</button>
        </form>
        <h2 className="subtitle">Storico Letture</h2>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Data</th>
                <th>Matricola</th>
                <th>Matricola Contatore</th>
                <th>Lettura Contatore</th>
                <th>PDR</th>
                <th>Azioni</th>
              </tr>
            </thead>
            <tbody>
              {storico.map((entry, index) => (
                <tr key={index}>
                  <td>{entry.data}</td>
                  <td>{entry.matricola}</td>
                  <td>{entry.matricolaContatore}</td>
                  <td>{entry.letturaContatore}</td>
                  <td>{entry.pdr}</td>
                  <td>
                    <button className="btn-delete" onClick={() => handleDelete(index)}>Elimina</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <h2 className="subtitle">Grafico Letture</h2>
        <div className="chart-container">
          <Line data={datiGrafico} />
        </div>
      </div>
    </div>
  );
}

export default App;
