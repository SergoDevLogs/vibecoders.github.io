import './App.css'
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';

import Auth from "./pages/Auth";
import MainLayout from "./components/MainLayout";
import Stock from "./pages/Stock";
import Orders from "./pages/Orders";
import History from "./pages/History";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

function App() {
  return(
      <>
          <Router>
                 <Routes>
                     <Route path="/" element={<Navigate to="/orders" replace />} />
                     
                     <Route path="/" element={
                         <ProtectedRoute>
                             <MainLayout />
                         </ProtectedRoute>
                     }>
                         <Route path={"/orders"} element={<Orders/>}></Route>
                         <Route path={"/stock"} element={<Stock/>}></Route>
                         <Route path={"/history"} element={<History/>}></Route>
                     </Route>

                     <Route path={"/auth"} element={<Auth/>}></Route>
                 </Routes>
          </Router>
      </>
  )
}

export default App