import { useState } from "react";
import apiClient from "../../services/apiClient";
import UserSidebar from "../../components/dashboard/UserSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";
import "../../styles/dashboard.css";

const UploadPage = () => {
  const [file, setFile] = useState(null);
  const [response, setResponse] = useState(null);

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await apiClient.post("/employee/upload", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setResponse(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="dashboard-layout">
      <UserSidebar />

      <div className="dashboard-main">
        <AdminTopbar title="Upload Sales File 📁" />

        <div className="dashboard-content">
          <div className="content-box">
            <input type="file" onChange={(e) => setFile(e.target.files[0])} />
            <button className="primary-btn" onClick={handleUpload}>
              Upload
            </button>

            {response && (
              <pre style={{ marginTop: "20px" }}>
                {JSON.stringify(response, null, 2)}
              </pre>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;