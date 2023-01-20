const Lessons = require('../models/lesson');
var asyncWrapper = require('../middlewares/asyncWrapper');
const { createCustomError } = require('../errors/custom_errors');
var randomToken = require('random-token');

exports.addlesson = asyncWrapper(async (req, res, next) => {
  const lessonId = randomToken(32);
  const { name } = req.body;
  let newLesson = {
    id: lessonId,
    name: name,
  };
  const lesson = await Lessons.add(newLesson);

  return res.status(201).json(lesson);
});

exports.getAllLessons = asyncWrapper(async (req, res, next) => {
  const dblessons = await Lessons.find();
  res.status(200).json(dblessons);
});

exports.getLessonByID = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;
  const dblesson = await Lessons.findById(id);
  dblesson === undefined
    ? res.status(404).json({ msg: `Lesson with id ${id} not found` })
    : res.status(200).json(dblesson);
});

exports.updateLessonByID = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;
  const changes = req.body;

  const updatedLesson = await Lessons.update(id, changes);

  updatedLesson === undefined
    ? res.status(404).json({ msg: `Lesson with id ${id} not found` })
    : res.status(200).json(updatedLesson);
});

exports.deleteLessonByID = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;
  const delLesson = await Lessons.remove(id);
  delLesson === undefined
    ? res.status(404).json({ msg: `Lesson with id ${id} not found` })
    : res.status(400).json({ msg: 'Lesson was deleted successfully' });
});
