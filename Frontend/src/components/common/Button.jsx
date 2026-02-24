const Button = ({ text, disabled }) => {
  return (
    <button className="btn" disabled={disabled}>
      {text}
    </button>
  );
};

export default Button;