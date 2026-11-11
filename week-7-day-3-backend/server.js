
import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import "dotenv/config";

import authenticateToken from "./middleware/auth.js";

const app = express();

const PORT = process.env.PORT || 4000;

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is missing from the .env file.");
}

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());

const users = [];

app.get("/", (req, res) => {
  res.json({
    message: "Authentication API is running.",
  });
});

// Register a new user.
app.post("/api/auth/register", async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({
        message: "Name, email, and password are required.",
      });
    }

    const trimmedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();

    if (trimmedName.length < 2) {
      return res.status(400).json({
        message: "Name must be at least 2 characters.",
      });
    }

    // Validate the email format.
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(normalizedEmail)) {
      return res.status(400).json({
        message: "Please provide a valid email address.",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters.",
      });
    }

    // Password must contain an uppercase letter.
    if (!/[A-Z]/.test(password)) {
      return res.status(400).json({
        message: "Password must contain at least one uppercase letter.",
      });
    }

    // Password must contain a number.
    if (!/[0-9]/.test(password)) {
      return res.status(400).json({
        message: "Password must contain at least one number.",
      });
    }

    const existingUser = users.find(
      (user) => user.email === normalizedEmail
    );

    if (existingUser) {
      return res.status(409).json({
        message: "An account with this email already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user object.
    const user = {
      id: users.length + 1,
      name: trimmedName,
      email: normalizedEmail,
      password: hashedPassword,
    };
    users.push(user);

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "24h",
      }
    );

    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
    };

    return res.status(201).json({
      message: "Registration successful.",
      token,
      user: userResponse,
    });
  } catch (error) {
    console.error("Registration error:", error);

    return res.status(500).json({
      message: "Something went wrong on the server.",
    });
  }
});

// Log in an existing user.
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Find the registered user.
    const user = users.find(
      (item) => item.email === normalizedEmail
    );

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    // Compare the entered password with the stored bcrypt hash.
    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "24h",
      }
    );

    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
    };

    return res.status(200).json({
      message: "Login successful.",
      token,
      user: userResponse,
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      message: "Something went wrong on the server.",
    });
  }
});

app.get("/api/auth/me", authenticateToken, (req, res) => {
  const user = users.find(
    (item) => item.id === req.user.userId
  );

  if (!user) {
    return res.status(404).json({
      error: "User not found.",
    });
  }

  // Exclude the password hash from the response.
  const { password, ...safeUser } = user;

  res.status(200).json({
    user: safeUser,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

