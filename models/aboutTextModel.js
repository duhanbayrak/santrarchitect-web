const mongoose = require("mongoose");

const aboutSchema = new mongoose.Schema({
    title:        { type: String, require: true },
    aboutText:   { type: String, require: true }
});

module.exports = mongoose.model("AboutText",aboutSchema);

