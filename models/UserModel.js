var mongoose = require("mongoose");

var UserSchema = new mongoose.Schema({
	phone: {type: String, required: true},
	firstName: {type: String, required: false},
	lastName: {type: String, required: false},
	status: {type: Boolean, required: true, default: 1}
}, {timestamps: true});

// Virtual for user's full name
UserSchema
	.virtual("fullName")
	.get(function () {
		return this.firstName + " " + this.lastName;
	});

module.exports = mongoose.model("User", UserSchema);