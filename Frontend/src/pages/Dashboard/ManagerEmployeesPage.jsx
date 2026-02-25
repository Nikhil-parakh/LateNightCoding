import { useEffect, useState } from "react";
import apiClient from "../../services/apiClient";
import ManagerSidebar from "../../components/dashboard/ManagerSidebar";
import ManagerTopbar from "../../components/dashboard/ManagerTopbar";
import "../../styles/dashboard.css";

const ManagerEmployeesPage = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  // ✅ GET ALL EMPLOYEES
  const fetchEmployees = async () => {
    try {
      const res = await apiClient.get("/company/employees", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setEmployees(res.data.employees);
    } catch (err) {
      console.error("Error fetching employees:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // ✅ ADD EMPLOYEE
  const handleAddEmployee = async (e) => {
    e.preventDefault();

    try {
      await apiClient.post(
        "/company/employees",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setShowForm(false);
      setFormData({ username: "", email: "", password: "" });
      fetchEmployees(); // refresh list

    } catch (err) {
      console.error("Error adding employee:", err);
      alert("Failed to add employee");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this employee?")) {
        return;
    }
    try {
        await apiClient.delete(`/company/employees/${id}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        });

        // remove from UI instantly
        setEmployees((prev) => prev.filter((emp) => emp.id !== id));

        alert("Employee removed successfully");
    } catch (err) {
        console.error(err);
        alert("Failed to remove employee");
    }
};

  return (
    <div className="dashboard-layout">
      <ManagerSidebar />

      <div className="dashboard-main">
        <ManagerTopbar title="Manage Employees 👥" />

        <div className="dashboard-content">

          <div className="top-actions">
            <h1 className="dashboard-title">Company Employees</h1>

            <button
              className="action-btn edit-btn"
              onClick={() => setShowForm(!showForm)}
            >
              + Add Employee
            </button>
          </div>

          {/* ADD FORM */}
          {showForm && (
            <div className="table-card" style={{ marginBottom: "20px" }}>
              <form onSubmit={handleAddEmployee}>
                <input
                  className="search-input"
                  placeholder="Username"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                />
                <input
                  className="search-input"
                  placeholder="Email"
                  style={{ marginLeft: "10px" }}
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
                <input
                  type="password"
                  className="search-input"
                  placeholder="Password"
                  style={{ marginLeft: "10px" }}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />

                <button
                  type="submit"
                  className="action-btn edit-btn"
                  style={{ marginLeft: "10px" }}
                >
                  Save
                </button>
              </form>
            </div>
          )}

          {/* TABLE */}
          <div className="table-card">
            {loading ? (
              <p>Loading employees...</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Created At</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {employees.map((emp) => (
                    <tr key={emp.id}>
                    <td>{emp.id}</td>
                    <td>{emp.username}</td>
                    <td>{emp.email}</td>
                    <td>{emp.created_at}</td>
                    <td>
                        <button
                        className="action-btn delete-btn"
                        onClick={() => handleDelete(emp.id)}
                        >
                        Remove
                        </button>
                    </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default ManagerEmployeesPage;