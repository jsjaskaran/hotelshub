// our hotel-deals model
var mongoose = require('mongoose');
var mongoosePages = require('mongoose-pages');

var dealsSchema = mongoose.Schema({
	name: String,
	image: String,
	rating: Number,
	link: String,
	actual_price: Number,
	discount: Number,
	location: String,
	city: String
});

dealsSchema.index({name: 'text', location: 'text'});

mongoosePages.skip(dealsSchema);

// finally create the model for export
module.exports = mongoose.model('Deals', dealsSchema);