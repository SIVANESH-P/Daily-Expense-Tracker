import { FaWallet, FaShoppingCart, FaBolt, FaWifi   } from 'react-icons/fa'; 
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import LineGraph from '../components/LineGraph';
import './Home.css';
import QuickAccess from '../components/QuickAccess';
import SummaryBar from '../components/SummaryBar';
import { useIncomeExpense } from '../context/IncomeExpenseContex';

const Home = () => {
  const {incomes, expenses, totalIncome, totalExpense} = useIncomeExpense();
  // Data for PieChart
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const totalMonthlyIncome = incomes.reduce((acc,income) => {
    const incomeDate = new Date(income.date);
    if(incomeDate.getMonth() === currentMonth && incomeDate.getFullYear() === currentYear){
      return acc + Number(income.amount)
    }
  },0);

  const totalMonthlyExpense = expenses.reduce((acc,expense) => {
    const expenseDate = new Date(expense.date);
    if(expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear){
      return acc + Number(expense.amount)
    }
  },0);

  const data = [
    { name: 'Income', value: totalMonthlyIncome },
    { name: 'Expense', value: totalMonthlyExpense },
    { name: 'Balance', value: (totalMonthlyIncome - totalMonthlyExpense) },
  ];

  const COLORS = ['#4caf50', '#f44336', '#2196f3']; // green, red, blue

  const recentTransactions = [
    { id: 1, type: 'Income', category: 'Salary', date: '2024-06-10', amount: 25000, icon: <FaWallet /> },
    { id: 2, type: 'Expense', category: 'Groceries', date: '2024-06-11', amount: 4000, icon: <FaShoppingCart /> },
    { id: 3, type: 'Expense', category: 'Electricity', date: '2024-06-09', amount: 1200, icon: <FaBolt /> },
    { id: 4, type: 'Income', category: 'Freelance', date: '2024-06-08', amount: 8000, icon: <FaWallet /> },
    { id: 5, type: 'Expense', category: 'Internet', date: '2024-06-07', amount: 1000, icon: <FaWifi /> },
  ];

  return (
    <>
    <SummaryBar income={totalIncome} expense={totalExpense} />
    <div className="home-container">
      <div className="column summary-column">
        <h3>Monthly Summary</h3>
      <div className="chart-wrapper">
        <PieChart width={250} height={250}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={70}
            fill="#8884d8"
            paddingAngle={3}
            dataKey="value"
            label
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend 
            wrapperStyle={{ paddingLeft: 0,top:215 }} 
          />
        </PieChart>
      </div>
      </div>

      <div className="column transactions-column">
        <h3>Recent Transactions</h3>
        <ul>
          {recentTransactions.map(txn => (
            <li key={txn.id} className={txn.type === 'Income' ? 'income' : 'expense'}>
              <div className="transaction-details">
                <span className="icon">{txn.icon}</span>
                <div className="category-info">
                  <span className="category">{txn.category}</span>
                  <span className="date">{txn.date}</span>
                </div>
              </div>
              <span className="amount">₹{txn.amount}</span>
            </li>
          ))}
        </ul>
      </div>

      <QuickAccess />
    </div>
    <LineGraph />
    </>
  );
};

export default Home;
