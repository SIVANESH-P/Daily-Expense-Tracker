import { createContext, useContext, useState, useEffect } from 'react';

const IncomeExpenseContext = createContext();

export const useIncomeExpense = () => useContext(IncomeExpenseContext);

export const IncomeExpenseProvider = ({ children }) => {
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    const storedIncomes = JSON.parse(localStorage.getItem('incomes')) || [];
    const storedExpenses = JSON.parse(localStorage.getItem('expenses')) || [];
    setIncomes(storedIncomes);
    setExpenses(storedExpenses);
  }, []);

  useEffect(() => {
    localStorage.setItem('incomes', JSON.stringify(incomes));
  }, [incomes]);

  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  const totalIncome = incomes.reduce((acc,income) => acc + Number(income.amount),0);
  const totalExpense = expenses.reduce((acc,expense) => acc + Number(expense.amount),0);

  return (
    <IncomeExpenseContext.Provider 
        value={{ incomes, setIncomes, expenses, setExpenses, totalIncome, totalExpense}}>
      {children}
    </IncomeExpenseContext.Provider>
  );
};
