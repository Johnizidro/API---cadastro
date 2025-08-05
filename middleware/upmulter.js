const multer = require('multer');

const storage = multer.memoryStorage(); // 👈 importante
const upload = multer({ storage });

module.exports = upload;