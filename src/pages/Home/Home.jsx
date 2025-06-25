import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import LineGraph from '../../components/LineGraph/LineGraph';
import './Home.css';
import QuickAccess from '../../components/QuickAccess/QuickAccess';
import SummaryBar from '../../components/SummaryBar/SummaryBar';
import { useIncomeExpense } from '../../context/IncomeExpenseContex';
import { useCategory } from '../../context/CategoryContext';

const Home = () => {
  const {incomes, expenses, totalIncome, totalExpense} = useIncomeExpense();
  const { incomeCategories, expenseCategories } = useCategory();
  // Data for PieChart
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const totalMonthlyIncome = incomes.reduce((acc,income) => {
    const incomeDate = new Date(income.date);
    if(incomeDate.getMonth() === currentMonth && incomeDate.getFullYear() === currentYear){
      return acc + Number(income.amount)
    }
    return acc;
  },0);

  const totalMonthlyExpense = expenses.reduce((acc,expense) => {
    const expenseDate = new Date(expense.date);
    if(expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear){
      return acc + Number(expense.amount)
    } 
    return acc;
  },0);

  const data = [
    { name: 'Income', value: totalMonthlyIncome },
    { name: 'Expense', value: totalMonthlyExpense },
    { name: 'Balance', value: (totalMonthlyIncome - totalMonthlyExpense) },
  ];

  const COLORS = ['#4caf50', '#f44336', '#2196f3']; // green, red, blue

  const incomeTransactionsWithType = incomes.map(function(txn) {
    return {
      ...txn,             
      type: 'Income'     
    };
  });

  const expenseTransactionsWithType = expenses.map(function(txn) {
    return {
      ...txn,
      type: 'Expense'
    };
  });

  const allTransactions = incomeTransactionsWithType.concat(expenseTransactionsWithType);


  const getCategoryIcon = (categoryName, type) => {
    const categories = type === 'Income' ? incomeCategories : expenseCategories;
    const category = categories.find(cat => cat.name === categoryName);
    return category ? category.icon : null;
  };

  const sortedTransactions = allTransactions.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);

    if (dateA > dateB) {
      return -1; 
    } else if (dateA < dateB) {
      return 1; 
    } else {
      return 0; 
    }
  });

  const recentTransactions = sortedTransactions.slice(0, 5);


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
            wrapperStyle={{ paddingLeft: 0,top:215, marginTop:24 }} 
          />
        </PieChart>
      </div>
      </div>

      <div className="column transactions-column">
        <h3>Recent Transactions</h3>
        <ul>
          {recentTransactions.map((txn, index) => (
            <li key={index} className={txn.type === 'Income' ? 'income' : 'expense'}>
              <div className="transaction-details">
                <span className="icon">{getCategoryIcon(txn.category, txn.type)}</span> 
                <div className="category-info">
                  <span className="category">{txn.category}</span>
                  <span className="date">{txn.date}</span>
                </div>
              </div>
              <span className="amount">{txn.type === 'Expense' ? '- ' : ''}₹{txn.amount}</span>
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
