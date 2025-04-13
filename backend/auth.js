// import express from "express";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";

// const router = express.Router();

// const testUser = {
//   email: "test@example.com",
//   passwordHash: "$2b$10$tyX6VFgkhq6sd0bxHMjY7.EKXEogyZDP/HnUFkfAZDzf1Qq2KouUK", 
//   username: "TestUser",
// };

// /*const password = "testpassword";
// bcrypt.hash(password, 10, (err, hash) => {
//   if (err) throw err;
//   console.log(hash); 
// });*/

// router.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (email !== testUser.email) {
//       return res.status(400).json({ error: "User not found" });
//     }

//     const isMatch = await bcrypt.compare(password, testUser.passwordHash);

//     if (!isMatch) {
//       return res.status(400).json({ error: "Invalid credentials" });
//     }

//     const token = jwt.sign({ id: testUser.id }, "testsecret", { expiresIn: "1h" });

//     res.json({ token, user: { id: testUser.id, username: testUser.username, email: testUser.email } });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// export default router;