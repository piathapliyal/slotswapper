import { Router } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = Router();


router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "Please fill all fields" });

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already in use" });

    const user = await User.create({ name, email, password });

    res.status(201).json({
      message: "Account created successfully 🎉",
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (err) {
    if (err?.code === 11000) return res.status(400).json({ message: "Email already in use" });
    res.status(500).json({ message: "Something went wrong" });
  }
});


router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const ok = await user.comparePassword(password);
    if (!ok) return res.status(400).json({ message: "Incorrect password" });

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.json({
      message: "Logged in successfully ✅",
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch {
    res.status(500).json({ message: "Something went wrong" });
  }
});

export default router;
