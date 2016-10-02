// contains rest api calls for the project

// load up the battle model
var Deals = require('../app/models/deals');
var ApiHits = require('../app/models/apihits');
var async = require('async');

// list hotel deals 
exports.listDeals = function(req, res){
	
	// check if query param present or not
	// if present, which one page or sortBy

	async.parallel({

		'apihit': function(callback){
			ApiHits.update({}, {'$inc': {'hits': 1}}, {upsert: true}, function(err, result){
				if(err)
					callback(err);
				callback(null, result);
			});
		},

		'list': function(callback){

			var docsPerPage = 6;

			if(req.query['page'] != undefined && req.query['sortBy'] == undefined){
				var pageNumber = parseInt(req.query['page']);
				if(req.query['page'] != ""){
					Deals.findPaginated({}, function(err, result){
						if(err){
							callback(err)
						}

						callback(null, result);
					}, docsPerPage, pageNumber);
				}else{
					res.json({status: 'error', data: "Please specify page number."});
					return;
				}
			}else if(req.query['sortBy'] != undefined){
				var pageNumber = req.query['page'] ? req.query['page'] : 1;

				if(req.query['sortBy'] == "rating"){
					Deals.findPaginated({}, null, {'sort': {'rating': 'ascending'}}, function(err, result){
						if(err){
							callback(err)
						}

						callback(null, result);
					}, docsPerPage, pageNumber);
				}else if(req.query['sortBy'] == "price"){
					Deals.findPaginated({}, null, {'sort': {'actual_price': 'ascending'}}, function(err, result){
						if(err){
							callback(err)
						}

						callback(null, result);
					}, docsPerPage, pageNumber);
				}else{
					res.json({status: 'error', data: "Invalid sort by parameter."});
					return;
				}
			}else{
				// neither page nor sortBy present, simple query
				var pageNumber = 1;
				Deals.findPaginated({}, function(err, result){
					if(err){
						callback(err)
					}

					callback(null, result);
				}, docsPerPage, pageNumber);
			}

		}

	}, function(err, results){
		if(err){
			res.json({status: "error", data: "Some error occurred."})
			return;
		}
		var toSend = results['list'];
		res.json({status: 'success', data: toSend});
	})

};

// get stats about fields from DB (DONE)
exports.getDbStats = function(req, res){
	async.waterfall([
		// increase hit count 
		function(callback){
			ApiHits.update({}, {'$inc': {'hits': 1}}, {upsert: true}).exec(function(err, result){
				if(err)
					callback(err)
				callback(null, 'done');
			});
		},

		// get average rating
		function(d, callback){
			Deals.aggregate(
				{$group: {
					_id: null,
					'average': {'$avg': '$rating'}
				}}
			).exec(function(err, docs){
				if(err)
					callback(err);
				result = {};
				result['average-rating'] = docs[0]['average'];
				callback(null, result);
			});
		},
		// find min and max of price
		function(d, callback){
			Deals.aggregate(
				{$group: {
					_id: null,
					'min': {'$min': '$actual_price'},
					'max': {'$max': '$actual_price'}
				}}
			).exec(function(err, docs){
				if(err)
					callback(err);
				d['price'] = {};
				d['price']['Minimum'] = docs[0]['min'];
				d['price']['Maximum'] = docs[0]['max'];
				callback(null, d);
			});
		},
		// area wise total distribution
		function(d, callback){
			Deals.aggregate(
				{$group: {
					_id: '$city',
					count: {'$sum': 1}
				}}
			).exec(function(err, docs){
				if(err)
					callback(err);
				d['area-wise-hotel-distribution'] = docs;
				callback(null, d);
			})
		},
		// get total api hits
		function(d, callback){
			ApiHits.find({}).exec(function(err, docs){
				if(err)
					callback(err);
				
				if(docs.length == 0){
					d['api-hits'] = 0;
				}else{
					d['api-hits'] = docs[0]['hits'];
				}
				callback(null, d);
			})
		}

	], function(err, result){
		if(err){
			res.json({status: "error", data: "Some error occurred."});
			return;
		}
		res.json({status: "success", data: result});
	});
};


// search functionality (DONE)
exports.searchDB = function(req, res){

	async.parallel({

		'apihit': function(callback){
			ApiHits.update({}, {'$inc': {'hits': 1}}, {upsert: true}, function(err, result){
				if(err)
					callback(err);
				callback(null, result);
			});
		},

		'search': function(callback){

			if(req.query['query'] != undefined){
				if(req.query['query'] != ""){
					var regex = new RegExp(req.query['query'], 'i');
					Deals.find({'$or': [{'name': regex}, {'location': regex}]}).distinct('_id', function(err, ids){
						Deals.find({'_id':{$in : ids}}, function(err, docs){
							if(err){
								callback(err);
							}

							callback(null, docs);
						})
					});

				}else{
					callback("Empty query for search.");
				}
			}

		}

	}, function(err, results){
		if(err){
			res.json({status: "error", data: err});
			return;
		}

		var toSend = results['search'];
		res.json({status: "success", data: toSend});
	})
	
};