// api hits model
var mongoose = require('mongoose');

var apiHitsSchema = mongoose.Schema({
	hits: {
		type: Number,
		default: 0
	}
});

module.exports = mongoose.model('ApiHits', apiHitsSchema);