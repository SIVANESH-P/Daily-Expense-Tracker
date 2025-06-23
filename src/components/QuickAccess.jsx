import { FaPlusCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useModal } from '../context/ModalContext';
import './QuickAccess.css'; 

const QuickAccess = () => {
  const navigate = useNavigate();
  const {setShowModal, setIsAdding} = useModal();
  
  const handleAddIncome = () => {
    navigate('/income');
    setShowModal(true);
  };

  const handleAddExpense = () => {
    navigate('/expense');
    setIsAdding(true);
  };

  return (
    <div className="column quick-access-column">
      <h3>Quick Access</h3>
      <div className='btn-container'>
        <button onClick={handleAddIncome}>
          <FaPlusCircle /> Add Income
        </button>
        <button onClick={handleAddExpense}>
          <FaPlusCircle /> Add Expense
        </button>
        <button >
          <FaPlusCircle /> Add Category
        </button>
      </div>
      
    </div>
  );
};

export default QuickAccess;
