import { useEffect, useState } from "react";
import apiClient from "../../services/apiClient";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";
import "../../styles/dashboard.css";

const CompaniesPage = () => {
  const [search, setSearch] = useState("");
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchCompanies(currentPage);
  }, [currentPage]);

  const fetchCompanies = async (page) => {
    try {
      setLoading(true);

      const res = await apiClient.get(`/admin/companies?page=${page}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setCompanies(res.data.companies);
      setPagination(res.data.pagination);
    } catch (error) {
      console.error("Error fetching companies:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCompanies = companies.filter((c) =>
    c.company_name.toLowerCase().includes(search.toLowerCase()),
  );

  const handleSuspend = async (id) => {
    try {
      await apiClient.patch(
        `/admin/company/${id}/suspend`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      alert("Company suspended successfully");
      fetchCompanies(currentPage); // refresh list
    } catch (error) {
      console.error(error);
      alert("Failed to suspend company");
    }
  };

  const handleRecover = async (id) => {
    try {
      await apiClient.patch(
        `/admin/company/${id}/recover`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      alert("Company recovered successfully");
      fetchCompanies(currentPage); // refresh list
    } catch (error) {
      console.error(error);
      alert("Failed to recover company");
    }
  };

  return (
    <div className="dashboard-layout">
      <AdminSidebar />

      <div className="dashboard-main">
        <AdminTopbar title="Manage Companies 🏢" />

        <div className="dashboard-content">
          <div className="page-header">
            <h1>Manage Companies 🏢</h1>
            <p>Add and manage registered companies</p>
          </div>

          <div className="top-actions">
            <input
              type="text"
              placeholder="Search Company..."
              className="search-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="table-card">
            {loading ? (
              <p>Loading companies...</p>
            ) : (
              <>
                <table>
                  <thead>
                    <tr>
                      <th>S No</th>
                      <th>Company Name</th>
                      <th>Industry</th>
                      <th>Uploads</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredCompanies.map((c, index) => (
                      <tr key={c.company_id}>
                        <td>{index + 1}</td>
                        <td>{c.company_name}</td>
                        <td>{c.industry}</td>
                        <td>{c.uploads}</td>
                        <td>
                          <span
                            className={`log-badge ${
                              c.status === "Active"
                                ? "login_success"
                                : "login_failed"
                            }`}
                          >
                            {c.status}
                          </span>
                        </td>

                        <td>
                          {c.status === "Active" ? (
                            <button
                              className="action-btn delete-btn"
                              onClick={() => handleSuspend(c.company_id)}
                            >
                              Suspend
                            </button>
                          ) : (
                            <button
                              className="action-btn edit-btn"
                              onClick={() => handleRecover(c.company_id)}
                            >
                              Recover
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}

                    {filteredCompanies.length === 0 && (
                      <tr>
                        <td
                          colSpan="6"
                          style={{ textAlign: "center", padding: "20px" }}
                        >
                          No companies found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>

                {pagination && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: "20px",
                    }}
                  >
                    <button
                      className="action-btn edit-btn"
                      disabled={!pagination.has_prev}
                      onClick={() => setCurrentPage((prev) => prev - 1)}
                    >
                      Previous
                    </button>

                    <span>
                      Page {pagination.current_page} of {pagination.total_pages}
                    </span>

                    <button
                      className="action-btn edit-btn"
                      disabled={!pagination.has_next}
                      onClick={() => setCurrentPage((prev) => prev + 1)}
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompaniesPage;
