import { useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, ResponsiveContainer
} from 'recharts';
import './Visualization.css';
import { useIncomeExpense } from '../../context/IncomeExpenseContex';

const Visualization = () => {
  const [filter, setFilter] = useState({ month: '', year: '' });
  const { incomes, expenses } = useIncomeExpense();

  const allDates = [...incomes, ...expenses].map(item => item.date);
  const uniqueMonths = [...new Set(allDates.map(date => date.slice(5, 7)))];
  const uniqueYears = [...new Set(allDates.map(date => date.slice(0, 4)))];

  if (!filter.month && !filter.year && allDates.length > 0) {
    const latestDate = allDates.sort((a, b) => new Date(b) - new Date(a))[0];
    setFilter({ month: latestDate.slice(5, 7), year: latestDate.slice(0, 4) });
  }

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

  const totalIncome = filteredIncome.reduce((sum, item) => sum + Number(item.amount), 0);

  const expenseBreakdown = expenseByCategory.map((item, index) => {
    const percentage = totalIncome > 0 ? ((item.value / totalIncome) * 100).toFixed(2) : 0;
    return {
      id: index + 1,
      category: item.name,
      amount: item.value,
      percentage
    };
  });


  const sortedIncomeByCategory = [...incomeByCategory].sort((a, b) => b.value - a.value).slice(0, 5);
  const sortedExpenseByCategory = [...expenseByCategory].sort((a, b) => b.value - a.value).slice(0, 5);

  const generateColor = () => {
    const randomColor = Math.floor(Math.random() * 16777215).toString(16);
    return `#${randomColor.padStart(6, '0')}`;
  };

  const incomeColors = sortedIncomeByCategory.map(() => generateColor());
  const expenseColors = sortedExpenseByCategory.map(() => generateColor());

  return (
    <div className="visualization-container">
      <div className="filter-section">
        <label>Month:
          <select name="month" value={filter.month} onChange={handleFilterChange}>
            {uniqueMonths.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </label>
        <label>Year:
          <select name="year" value={filter.year} onChange={handleFilterChange}>
            {uniqueYears.map(y => (
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
              <Pie data={sortedIncomeByCategory} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {sortedIncomeByCategory.map((entry, index) => (
                  <Cell key={`income-cell-${index}`} fill={incomeColors[index]} />
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
              <Pie data={sortedExpenseByCategory} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {sortedExpenseByCategory.map((entry, index) => (
                  <Cell key={`expense-cell-${index}`} fill={expenseColors[index]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend layout="vertical" verticalAlign="middle" align="right" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="expense-table">
        <h4>Where Your Money Goes</h4>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Category</th>
              <th>Amount Spent</th>
              <th>Spending (% of Income)</th>
            </tr>
          </thead>
          <tbody>
            {expenseBreakdown.map(row => (
              <tr key={row.id}>
                <td data-label="#"> {row.id} </td>
                <td data-label="Category"> {row.category} </td>
                <td data-label="Amount Spent"> ₹{row.amount.toLocaleString()} </td>
                <td data-label="% of Income"> {row.percentage}% </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Visualization;

