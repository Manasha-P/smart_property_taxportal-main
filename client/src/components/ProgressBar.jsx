const ProgressBar = ({ percentage }) => {
  const clamped = Math.min(100, Math.max(0, percentage));

  return (
    <div className="progress-wrapper">
      <div className="progress-track">
        <div
          className="progress-fill"
          style={{ width: `${clamped}%` }}
        />
      </div>
      <span className="progress-label">{clamped}%</span>
    </div>
  );
};

export default ProgressBar;