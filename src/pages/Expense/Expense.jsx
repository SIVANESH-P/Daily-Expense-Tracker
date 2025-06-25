import { useState} from 'react';
import './Expense.css';
import { FaPlusCircle, FaEdit, FaTrash, FaCheck, FaTimes } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useModal } from '../../context/ModalContext';
import { useIncomeExpense } from '../../context/IncomeExpenseContex';
import { useCategory } from '../../context/CategoryContext';

const Expense = () => {
  const {expenses, setExpenses} = useIncomeExpense();
  const [newExpense, setNewExpense] = useState({ date: '', category: '', amount: '', account: '', description: '' });
  const [editIndex, setEditIndex] = useState(null);
  const [editExpense, setEditExpense] = useState({ date: '', category: '', amount: '', account: '', description: '' });
  const [errors, setErrors] = useState({});
  
  const {isAdding,setIsAdding} = useModal();
  const {expenseCategories} = useCategory();

  const validate = (expense) => {
    const errors = {};
    if (!expense.date) errors.date = 'Date is required';
    if (!expense.category) errors.category = 'Category is required';
    if (!expense.amount || isNaN(expense.amount) || Number(expense.amount) <= 0) errors.amount = 'Valid amount is required';
    return errors;
  };

  const handleAddClick = () => {
    setIsAdding(true);
  };

  const handleInputChange = (e) => {
    setNewExpense({ ...newExpense, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleEditChange = (e) => {
    setEditExpense({ ...editExpense, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSave = () => {
    const validationErrors = validate(newExpense);
    if (Object.keys(validationErrors).length === 0) {
      setExpenses([newExpense, ...expenses]);
      toast.success('Expense added successfully!');
      setNewExpense({ date: '', category: '', amount: '', account: '', description: '' });
      setIsAdding(false);
      setErrors({});
    } else {
      setErrors(validationErrors);
    }
  };

  const handleEditSave = (index) => {
    const validationErrors = validate(editExpense);
    if (Object.keys(validationErrors).length === 0) {
      const updatedExpenses = [...expenses];
      updatedExpenses[index] = editExpense;
      setExpenses(updatedExpenses);
      toast.success('Expense updated successfully!');
      setEditIndex(null);
      setEditExpense({ date: '', category: '', amount: '', account: '', description: '' });
      setErrors({});
    } else {
      setErrors(validationErrors);
    }
  };

  const handleCancel = () => {
    setNewExpense({ date: '', category: '', amount: '', account: '', description: '' });
    setIsAdding(false);
    setErrors({});
  };

  const handleEditCancel = () => {
    setEditIndex(null);
    setEditExpense({ date: '', category: '', amount: '', account: '', description: '' });
    setErrors({});
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setEditExpense(expenses[index]);
  };

  const handleDelete = (index) => {
    const updatedExpenses = [...expenses];
    updatedExpenses.splice(index, 1);
    setExpenses(updatedExpenses);
    toast.info('Expense deleted');
  };

  return (
    <div className="expense-container">
      <ToastContainer />
      <div className="expense-summary">
        <h3>Total Expense: ₹{expenses.reduce((acc, expense) => acc + Number(expense.amount), 0)}</h3>
        <button onClick={handleAddClick}><FaPlusCircle /> Add Expense</button>
      </div>

      <table className="expense-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Category</th>
            <th>Amount</th>
            <th>Account</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {isAdding && (
            <tr className="new-expense-row">
              <td>
                <input type="date" name="date" value={newExpense.date} onChange={handleInputChange} />
                {errors.date && <span className="error-message">{errors.date}</span>}
              </td>
              <td>
                <select name="category" value={newExpense.category} onChange={handleInputChange}>
                  <option value="">Select</option>
                  {expenseCategories.map((cat, index) => (
                    <option key={index} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                {errors.category && <span className="error-message">{errors.category}</span>}
              </td>
              <td>
                <input type="number" name="amount" value={newExpense.amount} onChange={handleInputChange} placeholder="Amount" />
                {errors.amount && <span className="error-message">{errors.amount}</span>}
              </td>
              <td><input type="text" name="account" value={newExpense.account} onChange={handleInputChange} placeholder="Account (optional)" /></td>
              <td><input type="text" name="description" value={newExpense.description} onChange={handleInputChange} placeholder="Description (optional)" /></td>
              <td>
                <FaCheck className="action-icon" onClick={handleSave} />
                <FaTimes className="action-icon" onClick={handleCancel} />
              </td>
            </tr>
          )}

          {expenses.map((expense, index) => (
            editIndex === index ? (
              <tr key={index} className="edit-expense-row">
                <td><input type="date" name="date" value={editExpense.date} onChange={handleEditChange} />
                    {errors.date && <span className="error-message">{errors.date}</span>}
                </td>
                <td>
                  <select name="category" value={editExpense.category} onChange={handleEditChange}>
                    <option value="">Select</option>
                    <option value="Food">Food</option>
                    <option value="Transport">Transport</option>
                    <option value="Utilities">Utilities</option>
                  </select>
                  {errors.category && <span className="error-message">{errors.category}</span>}
                </td>
                <td><input type="number" name="amount" value={editExpense.amount} onChange={handleEditChange} />
                    {errors.amount && <span className="error-message">{errors.amount}</span>}
                </td>
                <td><input type="text" name="account" value={editExpense.account} onChange={handleEditChange} /></td>
                <td><input type="text" name="description" value={editExpense.description} onChange={handleEditChange} /></td>
                <td>
                  <FaCheck className="action-icon" onClick={() => handleEditSave(index)} />
                  <FaTimes className="action-icon" onClick={handleEditCancel} />
                </td>
              </tr>
            ) : (
              <tr key={index}>
                <td>{expense.date}</td>
                <td>{expense.category}</td>
                <td>₹{expense.amount}</td>
                <td>{expense.account}</td>
                <td>{expense.description}</td>
                <td>
                  <FaEdit className="action-icon" onClick={() => handleEdit(index)} />
                  <FaTrash className="action-icon" onClick={() => handleDelete(index)} />
                </td>
              </tr>
            )
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Expense;
