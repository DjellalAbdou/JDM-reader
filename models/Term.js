const mongoose = require("mongoose");

const { Schema } = mongoose;

const termScema = new Schema({
    eid: String,
    term: String,
});

mongoose.model("terms", termScema);
