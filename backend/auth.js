import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();

/* const testUser = {
  email: "test@example.com",
  passwordHash: "$2b$10$tyX6VFgkhq6sd0bxHMjY7.EKXEogyZDP/HnUFkfAZDzf1Qq2KouUK", 
  username: "TestUser",
}; */

/*const password = "testpassword";
bcrypt.hash(password, 10, (err, hash) => {
  if (err) throw err;
  console.log(hash); 
});*/

// testUser object to simulate a user database
let testUser = null;

router.post("/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // check if a test user already exists
        if (testUser && testUser.email === email) {
            return res.status(400).json({ error: "User already exists." });
        }

        // hash the password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // save the new user to memory
        testUser = {
            id: Date.now().toString(), // fake ID
            username,
            email,
            passwordHash,
        };

        // create jwt
        const token = jwt.sign({ id: testUser.id }, "testsecret", {
            expiresIn: "1h",
        });

        res.json({
            token,
            user: {
                id: testUser.id,
                username: testUser.username,
                email: testUser.email,
            },
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!testUser || email !== testUser.email) {
      return res.status(400).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, testUser.passwordHash);

    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: testUser.id }, "testsecret", { expiresIn: "1h" });

    res.json({ 
        token, 
        user: { 
            id: testUser.id, 
            username: testUser.username, 
            email: testUser.email, 
        }, 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;