import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Income from './pages/Income';
import Expense from './pages/Expense';
import Chart from './pages/Visualization';
import {ModalProvider} from './context/ModalContext';
import { IncomeExpenseProvider } from './context/IncomeExpenseContex';


function App() {
  return (
    <>
    <IncomeExpenseProvider>
      <ModalProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/income" element={<Income />} />
          <Route path="/expense" element={<Expense />} />
          <Route path="/chart" element={<Chart />} />
        </Routes>
      </Router>
      </ModalProvider>  
    </IncomeExpenseProvider>
    </>
  )
}

export default App
