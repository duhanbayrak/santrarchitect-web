const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
    title:          { type: String, require: true },
    category:       { type: String, require: true },
    projectName:    { type: String, require: true },
    intro:          { type: String, require: true },
    image_1:        { type: String, require: true },
    image_2:        { type: String},
    image_3:        { type: String},
    image_4:        { type: String},
    image_5:        { type: String},
    image_6:        { type: String},
    content:        { type: String, require: true },
    date:           {type: Date, default: Date.now}
    
       
   
});

module.exports = mongoose.model("Project",projectSchema);

