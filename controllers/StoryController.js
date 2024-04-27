const Story = require("../models/StoryModel");
const { body,validationResult } = require("express-validator");
const { sanitizeBody } = require("express-validator");
const apiResponse = require("../helpers/apiResponse");
const auth = require("../middlewares/jwt");
var mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);
const ObjectId = require('mongodb').ObjectId;



// Book Schema
function StoryData(data) {
	this.id = data._id;
	this.title= data.title;
	this.description = data.description;
    this.imageUrl = data.imageUrl;
	this.createdAt = data.createdAt;
}


/**
 * Story Add.
 * 
 * @param {string}      title 
 * @param {string}      description
 * @param {string}      imageUrl
 * 
 * @returns {Object}
 */
exports.storyAdd = [
	auth,
	body("title", "Title must not be empty.").isLength({ min: 1 }).trim(),
	body("description", "Description must not be empty.").isLength({ min: 1 }).trim(),
	body("imageUrl").optional().isURL().withMessage('Must be a URL'),
	
	sanitizeBody("*").escape(),
	(req, res) => {
		try {
			const errors = validationResult(req);
			var story = new Story(
				{ title: req.body.title,
					user: req.user,
					description: req.body.description,
					imageUrl: req.body.imageUrl,
					createdBy: req.user._id,
				});

			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}
			else {
				//Save book.
				story.save(function (err) {
					if (err) { return apiResponse.ErrorResponse(res, err); }
					let storyData = new StoryData(story);
					return apiResponse.successResponseWithData(res,"Story add Success.", storyData);
				});
			}
		} catch (err) {
            console.log(err);
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];

/**
* getWeekStories.
* @returns {Object}
*/
exports.getWeekStories = [
	auth,
	(req, res) => {
		try {
			// Get the current date
			const currentDate = new Date();

			// Subtract 7 days from the current date
			let pastDate = new Date(currentDate);
			pastDate.setDate(currentDate.getDate() - 7);

			console.log(currentDate, pastDate);

			const query = {
                createdAt: {
                    $lte: currentDate,
                    $gte: pastDate
                },
				createdBy: ObjectId(req.user._id)
            };
            const aggregation = [
				{ $match: query },				
				{
					$group: {
						_id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
						documents: { $push: "$$ROOT" } // Push the whole document into an array
					}
				},
				{ 
					$group: {
						_id: null,
						documents: {
							$push: {
								"date": "$_id",
								"stories": "$documents"
							}
						}
					}
				},
				{
					$unwind: "$documents"
				},
				{
					$replaceRoot: { "newRoot": "$documents" }
				},
				{ 
					$sort: { date: -1 } // Sorting by createdAt field in ascending order
				}
			];
			
            
            Story.aggregate(aggregation, function(err, results) {
                if (err) return apiResponse.ErrorResponse(res, err);
                return apiResponse.successResponseWithData(res,"Story add Success.", results);
            });
			
		} catch (err) {
            console.log(err);
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];