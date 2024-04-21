var express = require("express");
const StoryController = require("../controllers/StoryController");

var router = express.Router();


router.post("/", StoryController.storyAdd);
router.get("/", StoryController.getWeekStories);

module.exports = router;