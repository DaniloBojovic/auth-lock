const sqlite3 = require("sqlite3").verbose();
const jsonServer = require("json-server");
const jwt = require("jsonwebtoken");
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();
//const db = require("./db.json");
require("dotenv").config();

server.use(jsonServer.bodyParser);
server.use(middlewares);

// open the database
let db = new sqlite3.Database("./users.db", (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log("Connected to the SQLite database.");
});

// Drop the existing users table
db.run(`DROP TABLE IF EXISTS users`, (err) => {
  if (err) {
    console.error(err.message);
  }
});

// Create the users table
db.run(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY,
  username TEXT,
  password TEXT,
  role TEXT,
  email TEXT
  )`),
  (err) => {
    if (err) {
      console.error(err.message);
    }
  };

// Insert rows into the users table
let users = [
  {
    username: "user1",
    password: "password1",
    id: 1,
    role: "User",
    email: "user1@example.com",
  },
  {
    username: "user2",
    password: "password2",
    id: 2,
    role: "User",
    email: "user2@example.com",
  },
  {
    username: "admin",
    password: "admin",
    id: 3,
    role: "Admin",
    email: "admin@example.com",
  },
];

let stmt = db.prepare("INSERT OR REPLACE INTO users VALUES (?, ?, ?, ?, ?)");
for (let i = 0; i < users.length; i++) {
  stmt.run(
    users[i].id,
    users[i].username,
    users[i].password,
    users[i].role,
    users[i].email
  );
}
stmt.finalize();

// test the database
db.all("SELECT * FROM users", [], (err, rows) => {
  if (err) {
    throw err;
  }
  rows.forEach((row) => {
    console.log(`Row: ${row.id} ${JSON.stringify(row)}`);
  });
});

server.get("/users", (req, res) => {
  db.all("SELECT * FROM users", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    console.log("Rows:", rows);
    res.json(rows);
  });
});

// new code
server.post("/login", (req, res) => {
  const { username, password } = req.body;

  db.get(
    `SELECT username, password, email FROM users WHERE username = ? AND password = ?`,
    [username, password],
    (err, row) => {
      if (err) {
        console.error(err.message);
      }
      let user = row;

      if (user) {
        // Generate JWT token
        const token = jwt.sign(
          { userId: user.id, role: user.role, email: user.email },
          process.env.JWT_SECRET,
          {
            expiresIn: "1h",
          }
        );
        res.status(200).json({
          userId: user.id,
          token: token,
          role: user.role,
          email: user.email,
        });
      } else {
        res.status(401).json({ message: "Invalid username or password" });
      }
    }
  );
});

// close the database
// db.close((err) => {
//   if (err) {
//     console.error(err.message);
//   }
//   console.log("Close the database connection.");
// });

// Sample user credentials for demonstration purposes
// const users1 = [
//   {
//     username: "user1",
//     password: "password1",
//     id: 1,
//   },
//   {
//     username: "user2",
//     password: "password2",
//     id: 2,
//   },
//   {
//     username: "admin",
//     password: "admin",
//     id: 3,
//   },
// ];

// old code
// server.post("/login", (req, res) => {
//   const { username, password } = req.body;

//   const users = router.db.get("users").value();
//   console.log("Users:", users);

//   const user = users.find(
//     (u) => u.username === username && u.password === password
//   );

//   if (user) {
//     // Generate JWT token
//     const token = jwt.sign(
//       { userId: user.id, role: user.role },
//       process.env.JWT_SECRET,
//       {
//         expiresIn: "1h",
//       }
//     );
//     res.status(200).json({
//       userId: user.id,
//       token: token,
//       role: user.role,
//     });
//   } else {
//     res.status(401).json({ message: "Invalid username or password" });
//   }
// });

// new code
server.post("/register", (req, res) => {
  const { username, password, email, role } = req.body;

  // Check if user already exists
  db.get(`SELECT * FROM users WHERE username = ?`, [username], (err, row) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ message: "Internal server error" });
    }

    if (row) {
      return res.status(400).json({ message: "User already exists" });
    } else {
      // Create new user
      db.run(
        `INSERT INTO users (username, password, email) VALUES (?, ?, ?)`,
        [username, password, email],
        (err) => {
          if (err) {
            console.error(err.message);
            return res.status(500).json({ message: "Internal server error" });
          }
          res.status(201).json({ message: "User created successfully" });
        }
      );
    }
  });
});

// old code
// server.post("/register", (req, res) => {
//   const { username, password, role } = req.body;

//   // Check if user already exists
//   const existingUser = router.db.get("users").find({ username }).value();
//   if (existingUser) {
//     return res.status(400).json({ message: "User already exists" });
//   }

//   // Create new user
//   const newUser = { username, password, role };
//   router.db.get("users").push(newUser).write();
//   res.status(201).json({ message: "User created successfully" });
// });

server.use(router);
server.listen(3000, () => console.log("Server running on port 3000"));
