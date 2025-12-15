const Tour = require("../models/tourModel");
const mongoose = require("mongoose");

// GET /tours
const getAllTours = async (req, res) => {
  try {
    const user_id = req.user._id;
    const tours = await Tour.find({ user_id }).sort({ createdAt: -1 });
    res.status(200).json(tours);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve tours" });
  }
};

// POST /tours
const createTour = async (req, res) => {
  try {
    const user_id = req.user._id;
    const newTour = await Tour.create({ ...req.body, user_id });
    res.status(201).json(newTour);
  } catch (error) {
    res.status(400).json({ message: "Failed to create tour", error: error.message });
  }
};

// GET /tours/:tourId
const getTourById = async (req, res) => {
  try {
    const user_id = req.user._id;
    const { id } = req.params;
    const tour = await Tour.findOne({ _id: id, user_id });
    if (!tour) {
      return res.status(404).json({ message: "Tour not found or not authorized" });
    }
    res.status(200).json(tour);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve tour" });
  }
};

// PUT /tours/:tourId
const updateTour = async (req, res) => {
  try {
    const user_id = req.user._id;
    const { id } = req.params;
    const updatedTour = await Tour.findOneAndUpdate(
      { _id: id, user_id },
      { ...req.body },
      { new: true, runValidators: true }
    );
    if (!updatedTour) {
      return res.status(404).json({ message: "Tour not found or not authorized" });
    }
    res.status(200).json(updatedTour);
  } catch (error) {
    res.status(400).json({ message: "Failed to update tour", error: error.message });
  }
};

// DELETE /tours/:tourId
const deleteTour = async (req, res) => {
  try {
    const user_id = req.user._id;
    const { id } = req.params;
    const deletedTour = await Tour.findOneAndDelete({ _id: id, user_id });
    if (!deletedTour) {
      return res.status(404).json({ message: "Tour not found or not authorized" });
    }
    res.status(200).json({ message: "Tour deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete tour" });
  }
};
module.exports = {
  getAllTours,
  getTourById,
  createTour,
  updateTour,
  deleteTour,
};
