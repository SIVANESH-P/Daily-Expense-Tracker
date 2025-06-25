import './SummaryBar.css';

const SummaryBar = ({ income, expense }) => {
  const balance = income - expense;

  return (
    <div className="summary-bar">
      <div className="summary-item income">
        <h4>Total Income</h4>
        <p>₹{income}</p>
      </div>
      <div className="summary-item expense">
        <h4>Total Expense</h4>
        <p>₹{expense}</p>
      </div>
      <div className="summary-item balance">
        <h4>Balance</h4>
        <p>₹{balance}</p>
      </div>
    </div>
  );
};

export default SummaryBar;
