const express = require("express");
const router = express.Router();

const { aiAgent } = require("../Controllers/AIController");

router.post("/ai-agent", aiAgent);

module.exports = router;
