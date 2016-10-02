// all the routes for our application

module.exports = function(app, restcalls){

    // list all battles from DB
    app.get(['/api/v1/', '/api/v1/list'], restcalls.listDeals);

    // show stats
    app.get('/api/v1/stats', restcalls.getDbStats);

    // searching
    app.get('/api/v1/search', restcalls.searchDB);

    // website routes

    app.get('/', function(req, res){
        res.render('index');
    });

    app.get('/list', function(req, res){
        res.render('list');
    });

    app.get('/stats', function(req, res){
        res.render('stats');
    });

    app.get('/search', function(req, res){
        res.render('search');
    })

    // app.get('//')

    app.get('*', function(req, res){
        res.send('<h5>This is a 404 page</h5>');
    });

};