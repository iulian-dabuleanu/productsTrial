var express  = require('express'),
path     = require('path'),
bodyParser = require('body-parser'),
app = express(),
expressValidator = require('express-validator');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true })); 

app.use(bodyParser.json());
app.use(expressValidator());

var products = [
                {name: "test", model:"testModel", producer: "testProducer", price: 10, comments: []}
                ];

app.get('/',function(req,res){
	res.send('Welcome');
});


//RESTful route
var router = express.Router();


/*------------------------------------------------------
 *  This is router middleware,invoked everytime
 *  we hit url /api and anything after /api
 *  like /api/product , /api/product/7
 *  we can use this for doing validation,authetication
 *  for every route started with /api
--------------------------------------------------------*/
router.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With");
	res.header("Access-Control-Allow-Methods", "GET, PUT, POST, OPTIONS");
	console.log(req.method, req.url);
	if (req.method === 'OPTIONS') {
		console.log('!OPTIONS arrived');
		res.end(); 
	} else {
		next();
	}
});

var path = router.route('/product');

//show the CRUD interface | GET
path.get(function(req,res){
	res.json(products);
});


//post data to DB | POST
path.post(function(req,res){
	// validation
	req.assert('name','Name is required').notEmpty();
	req.assert('model','Model is required').notEmpty();
	req.assert('price','Price is required').isNumeric();
	var errors = req.validationErrors();
	if(errors){
		res.status(422).json(errors);
		return;
	}
	// get data
	var product = {
			name:req.body.name,
			model:req.body.model,
			description:req.body.description,
			price:req.body.price,
			comments: req.body.comments
	};
	products.push(product);
	res.sendStatus(200);
});


//now for Single route (GET,DELETE,PUT)
var pathext = router.route('/product/:product_id');

/*------------------------------------------------------
route.all is extremely useful. you can use it to do
stuffs for specific routes. for example you need to do
a validation everytime route /api/product/:product_id it hit.

remove pathext.all() if you dont want it
------------------------------------------------------*/
pathext.all(function(req,res,next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With");
	res.header("Access-Control-Allow-Methods", "GET, PUT, POST, OPTIONS");
	console.log(req.params);
	next();
});

//get data to update
pathext.get(function(req,res,next) {
	var product_id = req.params.product_id;
	var i;
	for (i = 0; i < products.length; i++) {
		if (products[i].name === product_id) {
			res.json(products[i]);
			return;
		}
	}
	return res.send("products Not found");
});

//update data
pathext.put(function(req,res){
	var product_id = req.params.product_id;
	// validation
	req.assert('name','Name is required').notEmpty();
	req.assert('model','Model is required').notEmpty();
	req.assert('price','Price is required').isNumeric();
	var errors = req.validationErrors();
	if(errors){
		res.status(422).json(errors);
		return;
	}
	// get data
	var product = {
			name:req.body.name,
			model:req.body.model,
			description:req.body.description,
			price:req.body.price,
			comments: req.body.comments
	};

	var i;
	for (i = 0; i < products.length; i++) {
		if (products[i].name === product_id) {
			products[i] = product;
			res.sendStatus(200);
			return;
		}
	}
	return res.send("products Not found");
});

//delete data
pathext.delete(function(req,res){
	var product_id = req.params.product_id;
	var i;
	for (i = 0; i < products.length; i++) {
		if (products[i].name === product_id) {
			products.splice(i, 1);
			res.sendStatus(200);
			return;
		}
	}
	return res.send("products Not found");
});

//now we need to apply our router here
app.use('/api', router);

//start Server
var server = app.listen(3000,function(){

	console.log("Listening to port %s",server.address().port);

});
