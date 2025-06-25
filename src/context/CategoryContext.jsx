import { createContext, useContext, useState, useEffect } from 'react';
import { FaMoneyBillWave, FaLaptopCode, FaChartLine, FaUtensils, FaCar, FaLightbulb, FaShoppingBag, FaTag } from 'react-icons/fa';

const CategoryContext = createContext();

export const useCategory = () => useContext(CategoryContext);

const defaultIncomeCategories = [
  { name: 'Salary', icon: <FaMoneyBillWave /> },
  { name: 'Freelance', icon: <FaLaptopCode /> },
  { name: 'Investments', icon: <FaChartLine /> },
];

const defaultExpenseCategories = [
  { name: 'Food', icon: <FaUtensils /> },
  { name: 'Transport', icon: <FaCar /> },
  { name: 'Utilities', icon: <FaLightbulb /> },
  { name: 'Shopping', icon: <FaShoppingBag /> },
];

export const CategoryProvider = ({ children }) => {
  const [incomeCategories, setIncomeCategories] = useState([]);
  const [expenseCategories, setExpenseCategories] = useState([]);

  useEffect(() => {
  const storedIncome = JSON.parse(localStorage.getItem('incomeCategories')) || [];
  const storedExpense = JSON.parse(localStorage.getItem('expenseCategories')) || [];

  const allIncomeCategories = [
    ...defaultIncomeCategories,
    ...storedIncome.filter(item => 
      !defaultIncomeCategories.some(defaultItem => defaultItem.name === item.name)
    )
  ];

  const allExpenseCategories = [
    ...defaultExpenseCategories,
    ...storedExpense.filter(item => 
      !defaultExpenseCategories.some(defaultItem => defaultItem.name === item.name)
    )
  ];

  setIncomeCategories(allIncomeCategories);
  setExpenseCategories(allExpenseCategories);
}, []);


  useEffect(() => {
    localStorage.setItem('incomeCategories', JSON.stringify(incomeCategories));
  }, [incomeCategories]);

  useEffect(() => {
    localStorage.setItem('expenseCategories', JSON.stringify(expenseCategories));
  }, [expenseCategories]);

  const addIncomeCategory = (name) => {
    setIncomeCategories(prev => [...prev, { name, icon: <FaTag /> }]);
  };

  const addExpenseCategory = (name) => {
    setExpenseCategories(prev => [...prev, { name, icon: <FaTag /> }]);
  };

  return (
    <CategoryContext.Provider value={{ 
      incomeCategories, 
      expenseCategories, 
      addIncomeCategory, 
      addExpenseCategory,
    }}>
      {children}
    </CategoryContext.Provider>
  );
};
