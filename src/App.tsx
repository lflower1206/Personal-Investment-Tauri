import { useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";

function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
    setGreetMsg(await invoke("greet", { name }));
  }

  return (
    <main className="container mx-auto p-8 flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-8">Welcome to Tauri + React</h1>

      <div className="flex gap-8 mb-8">
        <a href="https://vite.dev" target="_blank">
          <img src="/vite.svg" className="h-24 w-24 hover:drop-shadow-xl transition-all" alt="Vite logo" />
        </a>
        <a href="https://tauri.app" target="_blank">
          <img src="/tauri.svg" className="h-24 w-24 hover:drop-shadow-xl transition-all" alt="Tauri logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="h-24 w-24 hover:drop-shadow-xl transition-all animate-spin-slow" alt="React logo" />
        </a>
      </div>
      <p className="mb-8 text-gray-600">Click on the Tauri, Vite, and React logos to learn more.</p>

      <form
        className="flex gap-4 mb-4"
        onSubmit={(e) => {
          e.preventDefault();
          greet();
        }}
      >
        <input
          id="greet-input"
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setName(e.currentTarget.value)}
          placeholder="Enter a name..."
        />
        <button 
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Greet
        </button>
      </form>
      <p className="text-xl font-semibold">{greetMsg}</p>
    </main>
  );
}

export default App;
