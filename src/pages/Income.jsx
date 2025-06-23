import './Income.css';
import { FaPlusCircle, FaEdit, FaTrash } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState} from 'react';
import { useModal } from '../context/ModalContext';
import { useIncomeExpense } from '../context/IncomeExpenseContex';

const Income = () => {
  const {incomes, setIncomes} = useIncomeExpense();
  const [formData, setFormData] = useState({ date: '', category: '', amount: '', account: '' });
  const [errors, setErrors] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  
  const {showModal, setShowModal} = useModal();

  const validate = () => {
    const errors = {};
    if (!formData.date) errors.date = 'Date is required';
    if (!formData.category) errors.category = 'Category is required';
    if (!formData.amount || isNaN(formData.amount) || Number(formData.amount) <= 0) errors.amount = 'Valid amount is required';
    return errors;
  };

  const handleAddIncome = () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length === 0) {
      setErrors({});
      if (isEditMode) {
        const updatedIncomes = [...incomes];
        updatedIncomes[editIndex] = formData;
        setIncomes(updatedIncomes);
        toast.success('Income updated successfully!');
      } else {
        setIncomes([formData,...incomes]);
        toast.success('Income added successfully!');
      }

      
      setFormData({ date: '', category: '', amount: '', account: '' });
      setShowModal(false);
      setIsEditMode(false);
      setEditIndex(null);
    } else {
      setErrors(validationErrors);
    }
  };
  const handleDelete = (index) => {
    const updatedIncomes = [...incomes];
    updatedIncomes.splice(index, 1);
    setIncomes(updatedIncomes);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({...errors,[e.target.name] : ''});
  };

  const handleEdit = (index) => {
  const incomeToEdit = incomes[index];
  setFormData(incomeToEdit);
  setIsEditMode(true);
  setEditIndex(index);
  setShowModal(true);
};


  return (
    <div className="income-container">
      <ToastContainer />
      <div className="income-summary">
        <h3>Total Income: ₹{incomes.reduce((acc, income) => acc + Number(income.amount), 0)}</h3>
        <button onClick={() => setShowModal(true)}><FaPlusCircle /> Add Income</button>
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Add New Income</h3>
            <input type="date" name="date" value={formData.date} onChange={handleChange} />
            {errors.date && <span className="error">{errors.date}</span>}

            <select name="category" value={formData.category} onChange={handleChange}>
              <option value="">Select Category</option>
              <option value="Salary">Salary</option>
              <option value="Freelance">Freelance</option>
              <option value="Investment">Investment</option>
            </select>
            {errors.category && <span className="error">{errors.category}</span>}

            <input type="number" name="amount" placeholder="Amount" value={formData.amount} onChange={handleChange} />
            {errors.amount && <span className="error">{errors.amount}</span>}

            <input type="text" name="account" placeholder="Account (optional)" value={formData.account} onChange={handleChange} />

            <div className="modal-buttons">
              <button onClick={() => { setShowModal(false); setIsEditMode(false); }}>Cancel</button>
              <button onClick={handleAddIncome}>{isEditMode ? 'Update' : 'Add'}</button>
            </div>
          </div>
        </div>
      )}

      <table className="income-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Category</th>
            <th>Amount</th>
            <th>Account</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {incomes.map((income, index) => (
            <tr key={index}>
              <td>{income.date}</td>
              <td>{income.category}</td>
              <td>₹{income.amount}</td>
              <td>{income.account}</td>
              <td>
                <FaEdit className="action-icon" onClick={() => handleEdit(index)} />
                <FaTrash className="action-icon" onClick={() => handleDelete(index)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Income;