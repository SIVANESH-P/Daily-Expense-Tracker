import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router-dom';
import '../../pages/Home/Home.css';
import { useIncomeExpense } from '../../context/IncomeExpenseContex';

const LineGraph = () => {
  const { incomes, expenses } = useIncomeExpense();

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const thisMonthIncomes = incomes.filter(income => {
    const incomeDate = new Date(income.date);
    return incomeDate.getMonth() === currentMonth && incomeDate.getFullYear() === currentYear;
  });

  const thisMonthExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
  });

  const dayWiseData = [];
  for (let day = 1; day <= 31; day++) {
    const incomeForDay = thisMonthIncomes
      .filter(item => new Date(item.date).getDate() === day)
      .reduce((sum, curr) => sum + Number(curr.amount), 0);

    const expenseForDay = thisMonthExpenses
      .filter(item => new Date(item.date).getDate() === day)
      .reduce((sum, curr) => sum + Number(curr.amount), 0);

    if (incomeForDay !== 0 || expenseForDay !== 0) {
      dayWiseData.push({
        day: `${day}`,
        Income: incomeForDay,
        Expense: expenseForDay,
      });
    }
  }

  return (
    <div className="linechart-container">
      <h3>Income vs Expense (This Month)</h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={dayWiseData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="Income" stroke="#4caf50" strokeWidth={2} activeDot={{ r: 6 }} />
          <Line type="monotone" dataKey="Expense" stroke="#f44336" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>

      <div className="know-more-btn">
        <Link to="/Visualization">Know More →</Link>
      </div>
    </div>
  );
};

export default LineGraph;
