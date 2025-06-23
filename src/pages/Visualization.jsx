import { useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, ResponsiveContainer
} from 'recharts';
import './Visualization.css';
import { useIncomeExpense } from '../context/IncomeExpenseContex';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Visualization = () => {
  const [filter, setFilter] = useState({ month: '06', year: '2025' });
  const { incomes, expenses } = useIncomeExpense();

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter({ ...filter, [name]: value });
  };


  const filteredIncome = incomes.filter(item =>
    item.date.startsWith(`${filter.year}-${filter.month}`)
  );

  const filteredExpense = expenses.filter(item =>
    item.date.startsWith(`${filter.year}-${filter.month}`)
  );

  const mergedData = [];

  filteredIncome.forEach(item => {
    mergedData.push({ date: item.date, Income: Number(item.amount), Expense: 0 });
  });

  filteredExpense.forEach(item => {
    const existing = mergedData.find(entry => entry.date === item.date);
    if (existing) {
      existing.Expense = Number(item.amount);
    } else {
      mergedData.push({ date: item.date, Income: 0, Expense: Number(item.amount) });
    }
  });


  mergedData.sort((a, b) => new Date(a.date) - new Date(b.date));


  const incomeByCategory = Object.values(
    filteredIncome.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = { name: item.category, value: 0 };
      }
      acc[item.category].value += Number(item.amount);
      return acc;
    }, {})
  );

  const expenseByCategory = Object.values(
    filteredExpense.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = { name: item.category, value: 0 };
      }
      acc[item.category].value += Number(item.amount);
      return acc;
    }, {})
  );

  return (
    <div className="visualization-container">
      <div className="filter-section">
        <label>Month:
          <select name="month" value={filter.month} onChange={handleFilterChange}>
            {['01','02','03','04','05','06','07','08','09','10','11','12'].map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </label>
        <label>Year:
          <select name="year" value={filter.year} onChange={handleFilterChange}>
            {['2024','2025','2026'].map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </label>
      </div>

      <h3>Income vs Expense</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={mergedData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="Income" stroke="#4caf50" strokeWidth={2} />
          <Line type="monotone" dataKey="Expense" stroke="#f44336" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>

      <div className="donut-charts">
        <div className="chart-box">
          <h4>Income by Category</h4>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={incomeByCategory} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {incomeByCategory.map((entry, index) => (
                  <Cell key={`income-cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend layout="vertical" verticalAlign="middle" align="right" />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-box">
          <h4>Expense by Category</h4>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={expenseByCategory} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {expenseByCategory.map((entry, index) => (
                  <Cell key={`expense-cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend layout="vertical" verticalAlign="middle" align="right" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Visualization;
