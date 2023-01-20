const Hash = require("../models/hash");
var asyncWrapper = require("../middlewares/asyncWrapper");

exports.getAllHashes = asyncWrapper(async (req, res, next) => {
  const dbHashes = await Hash.findAllHashes();
  res.status(200).json(dbHashes);
});
