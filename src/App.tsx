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

      {error !== null && <p className="error">Fehler: {error}</p>}
      {state === "connecting" && <>verbinde...</>}
      {state === "user-click" && <>
        <button onClick={start}>
          Gerät koppeln
        </button>
      </>}
      {/* state === "connected" && */ <>
      <div className="value">
        <div className="value__key">Zieltemparatur</div>
        <div className="value__value">{data.tempTarget}°</div>
      </div>
      <div className="value value__invert">
        <div className="value__key">Innentemparatur</div>
        <div className="value__value">{data.tempIn1}° / {data.tempIn2}°</div>
      </div>
      <div className="value">
          <div className="value__key">Außentemparatur</div>
          <div className="value__value">{data.tempOut1}° / {data.tempOut2}°</div>
        </div>
        <div className="value value__invert">
          <div className="value__key">Spannung</div>
          <div className="value__value">{data.voltage}V</div>
        </div>
        <div className="value">
          <div className="value__key">Batteriezustand</div>
          <div className="value__value">{data.batteryStatus}</div>
        </div>
        <div className="value value__invert">
          <div className="value__key">Modus</div>
          <div className="value__value">{data.coolingMode}</div>
        </div>
      </>}
    </div>
  );
}

export default App;
