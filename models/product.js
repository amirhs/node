

// Dependecies

var restful = require('node-restful');
var mongoose = restful.mongoose;



// Schema
var productSchema = new mongoose.Schema({
	name: String,
	sku: String,
	price: Number
});


// Return modul
module.exports = restful.model('Products', productSchema);