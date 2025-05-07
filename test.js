// generate-password.js
const bcrypt = require("bcryptjs");

const password = "test123"; // Ganti dengan password yang kamu inginkan
const saltRounds = 12;

bcrypt.hash(password, saltRounds, function (err, hash) {
  if (err) throw err;
  console.log("Password:", password);
  console.log("Hash:", hash);
});
