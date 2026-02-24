import { useState } from "react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";
import "../../styles/dashboard.css";

const CompaniesPage = () => {
  const [search, setSearch] = useState("");

  const companies = [
    { id: 1, name: "TechNova Pvt Ltd", code: "comp01", type: "IT" },
    { id: 2, name: "GreenField Corp", code: "comp02", type: "Finance" },
  ];

  const filteredCompanies = companies.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="dashboard-layout">
      <AdminSidebar />

      <div className="dashboard-main">
        <AdminTopbar title="Manage Companies 🏢" />

        <div className="dashboard-content">

          {/* ===== HEADER ===== */}
          <div className="page-header">
            <h1>Manage Companies 🏢</h1>
            <p>Add and manage registered companies</p>
          </div>

          {/* ===== SEARCH + ADD ===== */}
          <div className="top-actions">
            <input
              type="text"
              placeholder="Search Company..."
              className="search-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

          
          </div>

          {/* ===== TABLE CARD ===== */}
          <div className="table-card">
            <table>
              <thead>
                <tr>
                  <th>S No</th>
                  <th>Company Name</th>
                  <th>Company Code</th>
                  <th>Type</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredCompanies.map((c, index) => (
                  <tr key={c.id}>
                    <td>{index + 1}</td>
                    <td>{c.name}</td>
                    <td>{c.code}</td>
                    <td>{c.type}</td>
                    <td>
                      <button className="action-btn edit-btn">
                        Edit
                      </button>
                      <button className="action-btn delete-btn">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredCompanies.length === 0 && (
                  <tr>
                    <td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>
                      No companies found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CompaniesPage;