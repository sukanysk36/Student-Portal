const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Attendance = require("../models/Attendance");
const Task = require("../models/Task");
const Message = require("../models/Message");

const router = express.Router();

// ==================== REGISTER ====================
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Please fill all required fields",
      });
    }

    // Check password length
    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists with this email",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "Registration successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        course: user.course,
        year: user.year,
      },
    });
  } catch (error) {
    console.error("Register error:", error);

    res.status(500).json({
      message: "Registration failed",
      error: error.message,
    });
  }
});

// ==================== LOGIN ====================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check required fields
    if (!email || !password) {
      return res.status(400).json({
        message: "Please enter email and password",
      });
    }

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Compare password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        course: user.course,
        year: user.year,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);

    res.status(500).json({
      message: "Server error during login",
    });
  }
});

// ==================== UPDATE PROFILE ====================
router.put("/profile/:id", async (req, res) => {
  try {
    const { name, course, year, college } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.name = name || user.name;
    user.course = course || user.course;
    user.year = year || user.year;

    // College is optional because it is not currently in the User model
    if (college !== undefined) {
      user.college = college;
    }

    await user.save();

    res.json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        course: user.course,
        year: user.year,
        college: user.college || "",
      },
    });
  } catch (error) {
    console.error("Profile update error:", error);

    res.status(500).json({
      message: "Profile update failed",
    });
  }
});

router.get("/test-profile", (req, res) => {
  res.json({ message: "Profile route file is working!" });
});

// ==================== ATTENDANCE ====================

// GET ATTENDANCE
router.get("/attendance/:userId", async (req, res) => {
  try {
    const attendance = await Attendance.findOne({
      userId: req.params.userId,
    });

    if (!attendance) {
      return res.json({
        attended: 0,
        totalClasses: 0,
        minimumTarget: 75,
      });
    }

    res.json(attendance);
  } catch (error) {
    console.error("Get attendance error:", error);

    res.status(500).json({
      message: "Failed to get attendance",
    });
  }
});

// SAVE / UPDATE ATTENDANCE
router.put("/attendance/:userId", async (req, res) => {
  try {
    const { attended, totalClasses, minimumTarget } = req.body;

    const attendance = await Attendance.findOneAndUpdate(
      { userId: req.params.userId },
      {
        userId: req.params.userId,
        attended,
        totalClasses,
        minimumTarget: minimumTarget || 75,
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      },
    );

    res.json({
      message: "Attendance updated successfully",
      attendance,
    });
  } catch (error) {
    console.error("Update attendance error:", error);

    res.status(500).json({
      message: "Failed to update attendance",
    });
  }
});

// ==================== TASKS ====================

// GET TASKS
router.get("/tasks/:userId", async (req, res) => {
  try {
    const tasks = await Task.find({
      userId: req.params.userId,
    }).sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    console.error("Get tasks error:", error);

    res.status(500).json({
      message: "Failed to get tasks",
    });
  }
});

// ADD TASK
router.post("/tasks/:userId", async (req, res) => {
  try {
    const { title, description, dueDate } = req.body;

    if (!title) {
      return res.status(400).json({
        message: "Task title is required",
      });
    }

    const task = await Task.create({
      userId: req.params.userId,
      title,
      description: description || "",
      dueDate: dueDate || "",
    });

    res.status(201).json({
      message: "Task added successfully",
      task,
    });
  } catch (error) {
    console.error("Add task error:", error);

    res.status(500).json({
      message: "Failed to add task",
    });
  }
});

// UPDATE TASK
router.put("/tasks/:id", async (req, res) => {
  try {
    const { title, description, dueDate, completed } = req.body;

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        dueDate,
        completed,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.json({
      message: "Task updated successfully",
      task,
    });
  } catch (error) {
    console.error("Update task error:", error);

    res.status(500).json({
      message: "Failed to update task",
    });
  }
});

// DELETE TASK
router.delete("/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.json({
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error("Delete task error:", error);

    res.status(500).json({
      message: "Failed to delete task",
    });
  }
});

/* =====================================================
   CONTACT MESSAGE
===================================================== */

router.post("/messages", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        message: "Please fill in all fields",
      });
    }

    const newMessage = await Message.create({
      name,
      email,
      subject,
      message,
    });

    res.status(201).json({
      message: "Message sent successfully",
      data: newMessage,
    });
  } catch (error) {
    console.error("Contact message error:", error);

    res.status(500).json({
      message: "Failed to send message",
    });
  }
});

module.exports = router;
