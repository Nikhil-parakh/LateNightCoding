const AdminStatCard = ({ title, value, color }) => {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${color}`}></div>

      <div>
        <h4>{title}</h4>
        <p>{value}</p>
      </div>
    </div>
  );
};

export default AdminStatCard;
