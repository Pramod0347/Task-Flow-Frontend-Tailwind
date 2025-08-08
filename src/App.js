import { BrowserRouter, Routes, Route } from "react-router";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import Boards from "./pages/Boards";
import Calendar from "./pages/Calendar";
import Settings from "./pages/Settings";


function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path='/' element={<Dashboard />} />
          <Route path='/boards' element={<Boards/>} />
          <Route path='/calendar' element={<Calendar />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
