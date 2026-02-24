const AdminStatCard = ({ title, value, color }) => {
  return (
    <div className={`stat-card ${color}`}>
      <div className="stat-content">
        <h4>{title}</h4>
        <p>{value}</p>
      </div>
    </div>
  );
};

export default AdminStatCard;