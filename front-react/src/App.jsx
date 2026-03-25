import { useState } from "react";
import Register from "./pages/Register";
import Login from "./pages/Login";
import QRCode from "./pages/QRCode";
import Success from "./pages/Success";

export default function App() {
  const [page, setPage] = useState("register");

  const pages = { register: Register, login: Login, qrcode: QRCode, success: Success };
  const Page = pages[page] || Register;

  return <Page onNavigate={setPage} />;
}
