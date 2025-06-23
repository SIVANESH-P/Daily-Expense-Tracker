import { Link } from 'react-router-dom';
import './Navbar.css'; 
import logo from  '../assets/logo.png';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img src={logo} alt="App Logo" className="logo" /> 
        <span className="app-name">Expense Tracker</span>
      </div>
      <div className="navbar-right">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/income" className="nav-link">Income</Link>
        <Link to="/expense" className="nav-link">Expense</Link>
        <Link to="/chart" className="nav-link">Visualization</Link>
      </div>
    </nav>
  );
};

export default Navbar;
