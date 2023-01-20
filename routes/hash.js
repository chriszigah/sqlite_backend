var express = require("express");
const router = express.Router();
const hashController = require("../controllers/users");

// @route GET api/
// @desc Fetch all hashes
// @access Private

router.get("/", hashController.getAllHashes);

module.exports = router;
