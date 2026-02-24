const Input = ({ type = "text", value, onChange, placeholder }) => {
  return (
    <input
      className="input"
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
  );
};

export default Input;