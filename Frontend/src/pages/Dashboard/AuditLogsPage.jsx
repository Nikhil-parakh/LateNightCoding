import { useEffect, useState } from "react";
import apiClient from "../../services/apiClient";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";
import "../../styles/dashboard.css";

const AuditLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await apiClient.get("/admin/audit-logs", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setLogs(response.data.logs);
      } catch (error) {
        console.error("Error fetching logs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  return (
    <div className="dashboard-layout">
      <AdminSidebar />

      <div className="dashboard-main">
        <AdminTopbar title="Audit Logs 📜" />

        <div className="dashboard-content">

          <div className="page-header">
            <h1>Audit Logs</h1>
            <p>Last 15 activities on the platform</p>
          </div>

          <div className="table-card">
            {loading ? (
              <p>Loading logs...</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Date & Time</th>
                    <th>Event Type</th>
                    <th>Message</th>
                  </tr>
                </thead>

                <tbody>
                  {logs.map((log, index) => (
                    <tr key={index}>
                      <td>{new Date(log.created_at).toLocaleString()}</td>
                      <td>
                        <span className={`log-badge ${log.event_type.toLowerCase()}`}>
                          {log.event_type}
                        </span>
                      </td>
                      <td>{log.message}</td>
                    </tr>
                  ))}

                  {logs.length === 0 && (
                    <tr>
                      <td colSpan="3" style={{ textAlign: "center", padding: "20px" }}>
                        No audit logs found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default AuditLogsPage;