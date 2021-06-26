import React from 'react';
import './App.css';
import { searchDevice } from './connection';

function App() {
  const [error, setError] = React.useState<string | null>(null);
  const [state, setState] = React.useState<"user-click" | "connecting">("user-click");

  async function start() {
      try {
        await searchDevice();
      } catch(error) {
        setError(error.message);
      }
    }

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
    </div>
  );
}

export default App;
