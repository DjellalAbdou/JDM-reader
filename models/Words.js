const mongoose = require("mongoose");

const { Schema } = mongoose;

const wordSchema = new Schema({
    word: String,
    eid: Number,
    def: [String],
    raffinement: [String],
    nodes: [Object],
    relations: [Object],
});

mongoose.model("words", wordSchema);
