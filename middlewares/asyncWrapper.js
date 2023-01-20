asyncWrapper = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (err) {
      next();
      throw Error(err);
    }
  };
};

module.exports = asyncWrapper;
