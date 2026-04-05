import { useState } from "react";
import Auth from "./components/Auth";
import Dashboard from "./components/Dashboard";

export default function App() {
  const [authed, setAuthed] = useState(!!localStorage.getItem("token"));

  return authed
    ? <Dashboard onLogout={() => setAuthed(false)} />
    : <Auth onLogin={() => setAuthed(true)} />;
}