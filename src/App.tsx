import React from 'react';
import './App.css';
import { getCooler } from './connection';

function App() {
  const [error, setError] = React.useState<string | null>(null);
  const [state, setState] = React.useState<"user-click" | "connecting" | "connected">("user-click");

  const [cooler, setCooler] = React.useState<{ getCharacteristic: () => Promise<any>} | null>(null);

  const [data, setData] = React.useState<{ value: string }>({ value: "" });

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
    const result = await cooler!.getCharacteristic();
    setData({ value: result });
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
      {state === "connected" && <>
        <p>Data: {data.value}</p>
      </>}
    </div>
  );
}

export default App;
