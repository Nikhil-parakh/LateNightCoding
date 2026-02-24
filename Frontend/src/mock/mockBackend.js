// fake database (temporary)
const users = [
  {
    email: "admin@system.com",
    password: "AdminPass123!",
    role: "admin",
  },
  {
    email: "manager@test.com",
    password: "Manager123!",
    role: "manager",
  },
  {
    email: "user@test.com",
    password: "User123!",
    role: "user",
  },
];

// fake token generator
const generateToken = (email, role) => {
  return `mock-token-${role}-${email}`;
};

// MOCK LOGIN
export const mockLogin = ({ email, password }) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = users.find(
        (u) => u.email === email && u.password === password,
      );

      if (!user) {
        reject(new Error("Invalid email or password"));
      } else {
        resolve({
          token: generateToken(user.email, user.role),
          user: { role: user.role },
        });
      }
    }, 800);
  });
};

// MOCK REGISTER (MANAGER ONLY)
export const mockRegister = (data) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const exists = users.find((u) => u.email === data.email);

      if (exists) {
        reject(new Error("Email already exists"));
        return;
      }

      users.push({
        email: data.email,
        password: data.password,
        role: "manager",
      });

      resolve({
        message: "Manager registered successfully",
      });
    }, 800);
  });
};
