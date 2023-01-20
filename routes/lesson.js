var express = require("express");
const router = express.Router();
const lessonController = require("../controllers/lesson");

// @route POST api/lessons
// @desc Create a lesson
// @access Private

router.post("/", lessonController.addlesson);

// @route GET api/lessons
// @desc Create a lesson
// @access Private

router.get("/", lessonController.getAllLessons);

// @route GET api/v1/lessons/:id
// @desc Get a lesson by ID
// @access Private

router.get("/:id", lessonController.getLessonByID);

// @route PATCH api/v1/:id
// @desc update a lesson by ID
// @access Private

router.patch("/:id", lessonController.updateLessonByID);

// @route DELETE api/v1/:id
// @desc delete a lesson by ID
// @access Private

router.delete("/:id", lessonController.deleteLessonByID);

router.post("/lessons/messages/:id", (req, res) => {
  const { id } = req.params;
  const msg = req.body;

  if (!msg.lesson_id) {
    msg["lesson_id"] = parseInt(id, 10);
  }

  Lessons.findById(id)
    .then((lesson) => {
      if (!lesson) {
        return res.status(404).json({ message: "Invalid id" });
      }
      // Check for all requied fields
      if (!msg.sender || !msg.text) {
        return res.status(400).json({
          message: "Must provide both Sender and Text",
        });
      }
      Lessons.addMessage(msg, id)
        .then((message) => {
          if (message) {
            return res.status(200).json(message);
          }
        })
        .catch((error) => {
          return res.status(500).json({ message: "something went wrong" });
        });
    })
    .catch((error) => {
      return res.status(500).json({ message: "Could not add message" });
    });
});

router.get("/messages", (req, res) => {
  Lessons.findAllMessages()
    .then((messages) => {
      res.status(200).json(messages);
    })
    .catch((error) => {
      res.status(500).json(console.log(error));
    });
});

module.exports = router;
