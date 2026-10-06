const express = require("express");
const router = express.Router();
const students = require("../data/students");

// Helpers
const parseId = (value) => {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
};

const isValidString = (v) => typeof v === "string" && v.trim().length > 0;

// GET /students - get all students
router.get("/", (req, res) => {
  res.status(200).json(students);
});

// GET /students/:id - get one student
router.get("/:id", (req, res) => {
  const id = parseId(req.params.id);
  if (id === null) {
    return res.status(400).json({ error: "Invalid student id" });
  }

  const student = students.find((s) => s.id === id);
  if (!student) {
    return res.status(404).json({ error: "Student not found" });
  }
  res.status(200).json(student);
});

// POST /students - create a student
router.post("/", (req, res) => {
  const { name, course } = req.body || {};

  if (!isValidString(name) || !isValidString(course)) {
    return res
      .status(400)
      .json({ error: "Both name and course are required and must be non-empty strings" });
  }

  const newId = students.length ? Math.max(...students.map((s) => s.id)) + 1 : 1;
  const newStudent = { id: newId, name: name.trim(), course: course.trim() };
  students.push(newStudent);

  res.status(201).json(newStudent);
});

// PUT /students/:id - update a student
router.put("/:id", (req, res) => {
  const id = parseId(req.params.id);
  if (id === null) {
    return res.status(400).json({ error: "Invalid student id" });
  }

  const { name, course } = req.body || {};
  if (!isValidString(name) || !isValidString(course)) {
    return res
      .status(400)
      .json({ error: "Both name and course are required and must be non-empty strings" });
  }

  const student = students.find((s) => s.id === id);
  if (!student) {
    return res.status(404).json({ error: "Student not found" });
  }

  student.name = name.trim();
  student.course = course.trim();
  res.status(200).json(student);
});

// DELETE /students/:id - delete a student
router.delete("/:id", (req, res) => {
  const id = parseId(req.params.id);
  if (id === null) {
    return res.status(400).json({ error: "Invalid student id" });
  }

  const index = students.findIndex((s) => s.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Student not found" });
  }

  const [deleted] = students.splice(index, 1);
  res.status(200).json({ message: "Student deleted successfully", student: deleted });
});

module.exports = router;
