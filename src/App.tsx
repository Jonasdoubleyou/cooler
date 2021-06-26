import React from 'react';
import './App.css';
import { Cooler, CoolerData, getCooler } from './connection';

function App() {
  const [error, setError] = React.useState<string | null>(null);
  const [state, setState] = React.useState<"user-click" | "connecting" | "connected">("user-click");

  const [cooler, setCooler] = React.useState<Cooler | null>(null);

  const [data, setData] = React.useState<CoolerData>({ 
    batteryStatus: "test",
    coolingMode: "test",
    tempIn1: 0,
    tempIn2: 0,
    tempOut1: 0,
    tempOut2: 0,
    tempTarget: 0,
    voltage: 0,
   });

  async function start() {
      setState("connecting");
      try {
        const cooler = await getCooler();
        setCooler(cooler);
        setState("connected");
      } catch(error) {
        setError(error.message);
      }
  }

  async function update() {
    const result = await cooler!.getData();
    setData(result);
  }

  React.useEffect(() => {
    if(!cooler) return;

    const updateTimer = setInterval(update, 10_000);
    return () => clearInterval(updateTimer);
  }, [cooler, update]);

  return (
    <div className="App">
      <h1>Kühlschrank</h1>

      {error !== null && <p>Fehler: {error}</p>}
      {state === "connecting" && <>verbinde...</>}
      {state === "user-click" && <>
        <button onClick={start}>
          Start
        </button>
      </>}
      {/* state === "connected" && */ <>
        <p>Zieltemparatur: {data.tempTarget}°C</p>
        <p>Innentemparatur: {data.tempIn1}°C / {data.tempIn2}°C</p>
        <p>Außentemparatur: {data.tempOut1}°C / {data.tempOut2}°C</p>
        <p>Spannung: {data.voltage}V</p>
        <p>Batteriezustand: {data.batteryStatus}</p>
        <p>Modus: {data.coolingMode}</p>
      </>}
    </div>
  );
}

export default App;
