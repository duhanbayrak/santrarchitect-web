const mongoose = require("mongoose");

const homeImageSchema = new mongoose.Schema({
   
    homeImage: { type: String}
    
       
   
});

module.exports = mongoose.model("HomeImage",homeImageSchema);

