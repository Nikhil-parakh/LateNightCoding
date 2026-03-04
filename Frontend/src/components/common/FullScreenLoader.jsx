const FullScreenLoader = () => {
  return (
    <div className="blur-loader-overlay">
      <div className="blur-loader-card">
        <div className="loader-spinner"></div>
        <p>Loading Dashboard...</p>
      </div>
    </div>
  );
};

export default FullScreenLoader;
