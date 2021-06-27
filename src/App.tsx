import React from 'react';
import './App.css';
import { Cooler, CoolerData, getCooler } from './connection';
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

function App() {
  const [error, setError] = React.useState<string | null>(null);
  const [state, setState] = React.useState<"user-click" | "connecting" | "connected">("user-click");

  const [cooler, setCooler] = React.useState<Cooler | null>(null);

  const [history, setHistory] = React.useState<(CoolerData & { time: Date })[]>([
    /* {
      batteryStatus: "test",
      coolingMode: "test",
      tempIn1: 20,
      tempIn2: 21,
      tempOut1: 22,
      tempOut2: 23, 
      tempTarget: 5,
      voltage: 10,
      time: new Date(1000)
    }, 
    {
      batteryStatus: "test",
      coolingMode: "test",
      tempIn1: 9,
      tempIn2: 8,
      tempOut1: 24,
      tempOut2: 25, 
      tempTarget: 5,
      voltage: 10,
      time: new Date(2000)
    },
    {
      batteryStatus: "test",
      coolingMode: "test",
      tempIn1: 6,
      tempIn2: 7,
      tempOut1: 23,
      tempOut2: 22, 
      tempTarget: 5,
      voltage: 10,
      time: new Date(3000)
    },
    {
      batteryStatus: "test",
      coolingMode: "test",
      tempIn1: 5,
      tempIn2: 4,
      tempOut1: 24,
      tempOut2: 25, 
      tempTarget: 5,
      voltage: 10,
      time: new Date(4000)
    } */
  ]);

  const [data, setData] = React.useState<CoolerData>({
    batteryStatus: "test",
    coolingMode: "test",
    tempIn1: 5,
    tempIn2: 5,
    tempOut1: 24,
    tempOut2: 25,
    tempTarget: 5,
    voltage: 0,
  });

  async function start() {
    setState("connecting");
    try {
      const cooler = await getCooler();
      setCooler(cooler);
      setState("connected");
    } catch (error) {
      setError(error.message);
    }
  }



  React.useEffect(() => {
    if (!cooler) return;

    async function update() {
      const result = await cooler!.getData();
      setData(result);
      setHistory(prev => prev.slice(-100).concat({ ...result, time: new Date() }));
    }

    update();

    const updateTimer = setInterval(update, 10_000);
    return () => clearInterval(updateTimer);
  }, [cooler]);

  return (
    <div className="App">
      <div className="container">
        <h1>Kühlschrank</h1>

        {error !== null && <p className="error">Fehler: {error}</p>}
        {state === "user-click" && <>
          <button onClick={start}>
            Gerät koppeln
        </button>
        </>}
      </div>


      {/* state === "connected" && */ <>
        <div className="container">
          <div className="values">
            <div className="value">
              <div className="value__key">Modus</div>
              <div className="value__value">{data.coolingMode}</div>
            </div>
            <div className="value">
              <div className="value__key">Zieltemparatur</div>
              <div className="value__value">{data.tempTarget}°</div>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="values">
            <div className="value">
              <div className="value__key">Innentemparatur</div>
              <div className="value__value">{data.tempIn1}° / {data.tempIn2}°</div>
            </div>
            <div className="value">
              <div className="value__key">Außentemparatur</div>
              <div className="value__value">{data.tempOut1}° / {data.tempOut2}°</div>
            </div>
          </div>

          <LineChart data={history} width={900} height={250}>
            <XAxis dataKey="time" tickFormatter={(time: Date) => time?.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit", second: "2-digit" }) ?? "unbekannt"} />
            <YAxis />
            <CartesianGrid stroke="#eee" strokeDasharray="5 5"/>

            <Line type="monotone" dataKey="tempIn1" stroke="var(--primary)" name="Innentemparatur 1"/>
            <Line type="monotone" dataKey="tempIn2" stroke="var(--primary)" name="Innentemparatur 2"/>
            <Line type="monotone" dataKey="tempOut1" stroke="var(--orange)" name="Außentemparatur 1"/>
            <Line type="monotone" dataKey="tempOut2" stroke="var(--orange)" name="Außentemparatur 2"/>
            <Line type="monotone" dataKey="tempTarget" stroke="var(--green)" name="Zieltemparatur" />
          </LineChart>
        </div>


        <div className="container">
          <div className="values">
            <div className="value">
              <div className="value__key">Spannung</div>
              <div className="value__value">{data.voltage}V</div>
            </div>
            <div className="value">
              <div className="value__key">Batteriezustand</div>
              <div className="value__value">{data.batteryStatus}</div>
            </div>
          </div>
        </div>
      </>}
    </div>
  );
}

export default App;
