import Login from "./components/Login";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignUp from "./components/SignUp";
import { Toaster } from "sonner";
import Home from "./components/Home";
import Admin from "./components/Admin";
import UserDetails from "./components/UserDetails";

function App() {
  return (
    <div className="App">
      <Toaster richColors />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/user/:id" element={<UserDetails />} />

          <Route path="/sign-in" element={<Login />} />
          <Route path="/sign-up" element={<SignUp />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
