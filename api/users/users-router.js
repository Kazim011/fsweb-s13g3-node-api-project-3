const express = require("express");

const middleware = require("../middleware/middleware");
const userModel = require("./users-model");
const postModel = require("../posts/posts-model");

// `users-model.js` ve `posts-model.js` sayfalarına ihtiyacınız var
// ara yazılım fonksiyonları da gereklidir

const router = express.Router();

router.get("/", (req, res, next) => {
  // TÜM KULLANICILARI İÇEREN DİZİYİ DÖNDÜRÜN

  userModel
    .get()
    .then((users) => {
      res.json(users);
    })
    .catch((error) => {
      next(error);
    });
});

router.get("/:id", middleware.validateUserId, (req, res, next) => {
  // USER NESNESİNİ DÖNDÜRÜN
  // user id yi getirmek için bir ara yazılım gereklidir
  res.json(req.user);
});

router.post("/", middleware.validateUser, (req, res, next) => {
  // YENİ OLUŞTURULAN USER NESNESİNİ DÖNDÜRÜN
  // istek gövdesini doğrulamak için ara yazılım gereklidir.
  userModel
    .insert({ name: req.name })
    .then((insertedUser) => {
      res.json(insertedUser);
    })
    .catch(next);
});

router.put(
  "/:id",
  middleware.validateUserId,
  middleware.validateUser,
  async (req, res, next) => {
    // YENİ GÜNCELLENEN USER NESNESİNİ DÖNDÜRÜN
    // user id yi doğrulayan ara yazılım gereklidir
    // ve istek gövdesini doğrulayan bir ara yazılım gereklidir.
    const { id } = req.params;
    try {
      await userModel.update(id, { name: req.name });
      let updated = await userModel.getById(id);
      res.status(201).json(updated);
    } catch (error) {
      next(error);
    }
  }
);

router.delete("/:id", middleware.validateUserId, async (req, res, next) => {
  // SON SİLİNEN USER NESNESİ DÖNDÜRÜN
  // user id yi doğrulayan bir ara yazılım gereklidir.
  const { id } = req.params;
  try {
    await userModel.remove(id);
    res.json(req.user);
  } catch (error) {
    next(error);
  }
});

router.get("/:id/posts", middleware.validateUserId, async (req, res, next) => {
  // USER POSTLARINI İÇEREN BİR DİZİ DÖNDÜRÜN
  // user id yi doğrulayan bir ara yazılım gereklidir.
  const { id } = req.params;
  try {
    let userPost = await userModel.getUserPosts(id);
    res.json(userPost);
  } catch (error) {
    next(error);
  }
});

router.post(
  "/:id/posts",
  middleware.validateUserId,
  middleware.validatePost,
  async (req, res, next) => {
    // YENİ OLUŞTURULAN KULLANICI NESNESİNİ DÖNDÜRÜN
    // user id yi doğrulayan bir ara yazılım gereklidir.
    // ve istek gövdesini doğrulayan bir ara yazılım gereklidir.
    const { id } = req.params;
    const { text } = req;
    try {
      let insertedPost = await postModel.insert({
        user_id: id,
        text: text,
      });
      res.json(insertedPost);
    } catch (error) {
      next(error);
    }
  }
);

router.use((err, req, res) => {
  res.status(err.status || 500).json({
    message: "bir hata oluştu",
    aMessage: err.message,
  });
});
// routerı dışa aktarmayı unutmayın

module.exports = router;
