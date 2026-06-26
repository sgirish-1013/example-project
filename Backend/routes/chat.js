const express = require("express");
const router = express.Router();
const {
  setupProfile,
  sendMessage,
  getHistory,
  clearSession
} = require("../controllers/chatController");

router.post("/profile", setupProfile);
router.post("/chat", sendMessage);
router.get("/history", getHistory);
router.post("/clear", clearSession);

module.exports = router;