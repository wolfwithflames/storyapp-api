var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var StorySchema = new Schema({
	title: {type: String, required: true},
	description: {type: String, required: true},
	imageUrl: {type: String, required: false},
	createdBy: { type: Schema.ObjectId, ref: "User", required: true },
}, {timestamps: true});

module.exports = mongoose.model("Story", StorySchema);