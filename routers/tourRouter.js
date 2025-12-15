const express = require("express");
const requireAuth = require("../middleware/requireAuth");
const router = express.Router();

router.use(requireAuth);

const {
  getAllTours,
  getTourById,
  createTour,
  updateTour,
  deleteTour,
} = require("../controllers/tourControllers");


router.get("/", getAllTours);
router.post("/", createTour);
router.get("/:tourId", getTourById);
router.put("/:tourId", updateTour);
router.delete("/:tourId", deleteTour);

module.exports = router;
