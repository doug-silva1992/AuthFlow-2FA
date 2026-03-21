import { BrowserRouter, Routes, Route } from "react-router-dom"
import SignUp from "./pages/SignUp"
import SignIn from "./pages/SignIn"
import QRCodeSignup from "./pages/QRCodeSignup"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/qr-code-signup" element={<QRCodeSignup />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App