import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home/Home';
import Income from './pages/Income/Income';
import Expense from './pages/Expense/Expense';
import Visualization from './pages/Visualization/Visualization';
import {ModalProvider} from './context/ModalContext';
import { IncomeExpenseProvider } from './context/IncomeExpenseContex';
import { CategoryProvider } from './context/CategoryContext';


function App() {
  return (
    <>
    <IncomeExpenseProvider>
      <CategoryProvider>
        <ModalProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/income" element={<Income />} />
            <Route path="/expense" element={<Expense />} />
            <Route path="/Visualization" element={<Visualization />} />
          </Routes>
        </Router>
        </ModalProvider>  
      </CategoryProvider>
    </IncomeExpenseProvider>
    </>
  )
}

export default App
