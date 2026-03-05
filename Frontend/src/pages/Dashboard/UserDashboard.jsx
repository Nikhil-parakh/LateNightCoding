import UserLayout from "../../layouts/UserLayout";
import Chatbot from "../../components/chatbot/Chatbot";

const UserDashboard = () => {
  return (
    <UserLayout>
      <h1 className="dashboard-title">Employee Dashboard</h1>

      <p className="dashboard-subtitle">Welcome to your sales dashboard.</p>

      <Chatbot />
    </UserLayout>
  );
};

export default UserDashboard;
