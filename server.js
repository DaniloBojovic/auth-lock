const sqlite3 = require('sqlite3').verbose();
const jsonServer = require('json-server');
const jwt = require('jsonwebtoken');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
const nodemailer = require('nodemailer');
//const db = require("./db.json");
require('dotenv').config();

const generate2FACode = () => {
  return Math.floor(100000 + Math.random() * 900000);
};
const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

server.use(jsonServer.bodyParser);
server.use(middlewares);

// open the database
let db = new sqlite3.Database('./users.db', (err) => {
  if (err) {
    console.error(err.message);
  }
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
// let users = [
//   {
//     username: "user1",
//     password: "password1",
//     id: 1,
//     role: "User",
//     email: "user1@example.com",
//   },
//   {
//     username: "user2",
//     password: "password2",
//     id: 2,
//     role: "User",
//     email: "user2@example.com",
//   },
//   {
//     username: "admin",
//     password: "admin",
//     id: 3,
//     role: "Admin",
//     email: "admin@example.com",
//   },
// ];
let users = [];

for (let i = 0; i < 40; i++) {
  const isAdmin = i % 5 === 0;

  users.push({
    username: isAdmin ? `admin${i}` : `user${i}`,
    password: `password${i}`,
    id: i,
    role: isAdmin ? 'Admin' : 'User', // Set role based on whether the user is an admin
    email: isAdmin ? `admin${i}@example.com` : `user${i}@example.com`,
  });
}

let stmt = db.prepare('INSERT OR REPLACE INTO users VALUES (?, ?, ?, ?, ?)');
for (let i = 0; i < users.length; i++) {
  stmt.run(users[i].id, users[i].username, users[i].password, users[i].role, users[i].email);
}
stmt.finalize();

// test the database
db.all('SELECT * FROM users', [], (err, rows) => {
  if (err) {
    throw err;
  }
  rows.forEach((row) => {
    console.log(`Row: ${row.id} ${JSON.stringify(row)}`);
  });
});

server.get('/users', (req, res) => {
  const page = Number(req.query.page || 1);
  const pageSize = Number(req.query.pageSize || 10);
  const property = req.query.property || 'username';
  const searchTerm = req.query.searchTerm || '';
  const order = req.query.sort || 'asc';
  const offset = (page - 1) * pageSize;

  // Get total number of users that match the search term
  db.all('SELECT COUNT(*) as totalUsers FROM users where username LIKE ?', [`%${searchTerm}%`], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    const totalUsers = result[0].totalUsers;

    //Get paginated users
    db.all(
      `SELECT * FROM users where username LIKE ? ORDER BY ${property} ${order} LIMIT ? OFFSET ?`,
      [`%${searchTerm}%`, pageSize, offset],
      (err, rows) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        //Return both totalUser and users
        res.json({ totalUsers, users: rows });
      }
    );
  });
});

// new code
server.post('/login', (req, res) => {
  const { username, password } = req.body;

  db.get(
    `SELECT username, password, email, role FROM users WHERE username = ? AND password = ?`,
    [username, password],
    (err, row) => {
      if (err) {
        console.error(err.message);
      }
      let user = row;

      if (user) {
        // Generate JWT token
        const token = jwt.sign({ userId: user.id, role: user.role, email: user.email }, process.env.JWT_SECRET, {
          expiresIn: '1h',
        });

        const code = generate2FACode();

        res.status(200).json({
          userId: user.id,
          token: token,
          role: user.role,
          email: user.email,
          code: code, // Return the 2FA code
        });
      } else {
        res.status(401).json({ message: 'Invalid username or password' });
      }
    }
  );
});

server.post('/send-sms', (req, res) => {
  const { phoneNumber, message } = req.body;

  // Log the phoneNumber and message
  console.log(`PhoneNumber: ${phoneNumber}, Message: ${message}`);
  console.log(`TWILIO_PhoneNumber: ${process.env.TWILIO_PHONE_NUMBER}`);

  client.messages
    .create({
      body: message,
      from: '+12563968528', //process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber,
    })
    .then((message) => res.status(200).json({ message: 'SMS sent successfully' }))
    .catch((err) => res.status(500).json({ error: err.message }));
});

server.post('/send-email', (req, res) => {
  const { email, message } = req.body;
  console.log(`Email: ${email}, Message: ${message}`);
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  let mailOptions = {
    from: process.env.EMAIL_USERNAME,
    to: email,
    subject: 'Your 2FA Code',
    text: message,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      res.status(500).json({ error: error.message });
    } else {
      console.log('Email sent: ' + info.response);
      res.status(200).json({ message: 'Email sent successfully' });
    }
  });
});

server.post('/register', (req, res) => {
  const { username, password, email, role } = req.body;

  // Check if user already exists
  db.get(`SELECT * FROM users WHERE username = ?`, [username], (err, row) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ message: 'Internal server error' });
    }

    if (row) {
      return res.status(400).json({ message: 'User already exists' });
    } else {
      // Create new user
      db.run(`INSERT INTO users (username, password, email) VALUES (?, ?, ?)`, [username, password, email], (err) => {
        if (err) {
          console.error(err.message);
          return res.status(500).json({ message: 'Internal server error' });
        }
        //res.status(201).json({ message: "User created successfully" });
        // Get the newly created user
        db.get(`SELECT * FROM users WHERE username = ?`, [username], (err, newUser) => {
          if (err) {
            console.error(err.message);
            return res.status(500).json({ message: 'Internal server error' });
          }

          // Return the newly created user
          res.status(201).json(newUser);
        });
      });
    }
  });
});

// server.put("/users/:id", (req, res) => {
//   console.log(req.body.role);
//   const user = users.find((u) => u.id === parseInt(req.params.id));
//   if (!user) {
//     return res.status(404).send("User not found");
//   }
//   console.log("User role before:", user.role);
//   user.role = req.body.role;
//   console.log("User role after:", user.role);
//   res.send(user);
// });

server.put('/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const newRole = req.body.role;

  // Select the user before updating
  db.get(`SELECT * FROM users WHERE id = ?`, [userId], (err, user) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ message: 'Internal server error' });
    }
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    // Update the user
    db.run(`UPDATE users SET role = ? WHERE id = ?`, [newRole, userId], (err) => {
      if (err) {
        console.error(err.message);
        return res.status(500).json({ message: 'Internal server error' });
      }

      // Select the updated user
      db.get(`SELECT * FROM users WHERE id = ?`, [userId], (err, updatedUser) => {
        if (err) {
          console.error(err.message);
          return res.status(500).json({ message: 'Internal server error' });
        }
        if (!updatedUser) {
          return res.status(404).send({ message: 'User not found' });
        }

        res.send(updatedUser);
      });
    });
  });
});

server.use(router);
server.listen(3000, () => console.log('Server running on port 3000'));
