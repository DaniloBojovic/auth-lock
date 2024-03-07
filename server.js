const jsonServer = require("json-server");
const jwt = require("jsonwebtoken");
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();
const db = require("./db.json");
require("dotenv").config();

server.use(jsonServer.bodyParser);
server.use(middlewares);

// Sample user credentials for demonstration purposes
const users1 = [
  {
    username: "user1",
    password: "password1",
    id: 1,
  },
  {
    username: "user2",
    password: "password2",
    id: 2,
  },
  {
    username: "admin",
    password: "admin",
    id: 3,
  },
];

server.post("/login", (req, res) => {
  console.log("Received login request:", req.body);
  // Retrieve username and password from request body
  const { username, password } = req.body;

  const users = router.db.get("users").value();
  console.log("Users:", users);

  debugger;

  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (user) {
    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
    res.status(200).json({
      userId: user.id,
      token: token,
      role: user.role,
    });
  } else {
    res.status(401).json({ message: "Invalid username or password" });
  }
});

server.use(router);
server.listen(3000, () => console.log("Server running on port 3000"));
