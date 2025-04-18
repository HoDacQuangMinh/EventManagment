const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;
const MONGO_URI = "mongodb://localhost:27017/eventdb"; // or Atlas URI

app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// Mongoose Schema
const eventSchema = new mongoose.Schema({
  title: String,
  description: String,
  date: Date
});
const Event = mongoose.model("Event", eventSchema);

// Routes

// Get all events
app.get("/events", async (req, res) => {
  const events = await Event.find().sort({ date: 1 });
  res.json(events);
});

// Create new event
app.post("/events", async (req, res) => {
  const newEvent = new Event(req.body);
  await newEvent.save();
  res.status(201).json(newEvent);
});

// Edit an event
app.put("/events/:id", async (req, res) => {
  const updated = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

// Delete an event
app.delete("/events/:id", async (req, res) => {
  await Event.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
