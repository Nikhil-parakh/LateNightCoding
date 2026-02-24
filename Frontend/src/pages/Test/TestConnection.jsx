import { useEffect } from "react";
import apiClient from "../../services/apiClient";

const TestConnection = () => {
  useEffect(() => {
    apiClient.get("/admin/public-test")
      .then(res => console.log("Backend Response:", res.data))
      .catch(err => console.error("Error:", err));
  }, []);

  return <div style={{ padding: "40px" }}>Testing Backend...</div>;
};

export default TestConnection;