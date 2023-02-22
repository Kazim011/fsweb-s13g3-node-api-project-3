const usersModel = require("../users/users-model");

function logger(req, res, next) {
  // SİHRİNİZİ GÖRELİM

  const method = req.method;
  const url = req.originalUrl;
  const timestamt = new Date().toLocaleString();

  console.log(`${method} -- ${url} -- ${timestamt}`);
}

async function validateUserId(req, res, next) {
  // SİHRİNİZİ GÖRELİM
  try {
    let existUser = await usersModel.getById(req.params.id);
    if (!existUser) {
      res.status(404).json({ message: "not found" });
    } else {
      req.user = existUser;
      next();
    }
  } catch (error) {
    res.status(500).json({ message: "Hata oluştu." });
  }
}

function validateUser(req, res, next) {
  // SİHRİNİZİ GÖRELİM
  const { name } = req.body;
  if (!name) {
    res.status(400).json({ message: "gerekli name alanı eksik" });
  } else {
    req.name = name;
    next();
  }
}

function validatePost(req, res, next) {
  // SİHRİNİZİ GÖRELİM
  const { text } = req.body;
  if (!text) {
    res.status(400).json({ message: "gerekli text alanı eksik" });
  } else {
    req.text = text;
    next();
  }
}

// bu işlevleri diğer modüllere değdirmeyi unutmayın

module.exports = {
  logger,
  validateUserId,
  validateUser,
  validatePost,
};
