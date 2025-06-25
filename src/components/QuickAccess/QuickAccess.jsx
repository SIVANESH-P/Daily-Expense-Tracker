import { FaPlusCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useModal } from '../../context/ModalContext';
import { useCategory } from '../../context/CategoryContext';
import { useState } from 'react';
import './QuickAccess.css'; 

const QuickAccess = () => {
  const navigate = useNavigate();
  const {setShowModal, setIsAdding} = useModal();
  const { addIncomeCategory, addExpenseCategory } = useCategory();
  const [newCategory, setNewCategory] = useState('');
  const [categoryType, setCategoryType] = useState(''); 
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [error, setError] = useState('');

  
  const handleAddIncome = () => {
    navigate('/income');
    setShowModal(true);
  };

  const handleAddExpense = () => {
    navigate('/expense');
    setIsAdding(true);
  };

  const openCategoryModal = (type) => {
    setCategoryType(type);
    setNewCategory('');
    setShowCategoryModal(true);
  };

  const handleCategorySubmit = () => {
    if(newCategory.trim() === '') {
      setError("Category name cannot be empty");
    } else {
      if(categoryType === 'income') addIncomeCategory(newCategory);
      if (categoryType === 'expense') addExpenseCategory(newCategory);
      setShowCategoryModal(false);
      setError('');
    }
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
        <button onClick={() => openCategoryModal('income')}>
          <FaPlusCircle /> Add Income Category
        </button>
        <button onClick={() => openCategoryModal('expense')}>
          <FaPlusCircle /> Add Expense Category
        </button>
      </div>
      {showCategoryModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Add {categoryType === 'income' ? 'Income' : 'Expense'} Category</h3>
            <input
              type="text"
              value={newCategory}
              onChange={(e) => {
                setError('');
                setNewCategory(e.target.value)}}
              placeholder="Enter category name"
            />
            {error && <span className="error">{error}</span>}
            <div className="modal-buttons">
              <button onClick={() => setShowCategoryModal(false)}>Cancel</button>
              <button onClick={handleCategorySubmit}>Add</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuickAccess;
