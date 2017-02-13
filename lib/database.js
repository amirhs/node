var mysql = require('mysql');

var db = function(){};

db.prototype.connection = function () {
  var connection = mysql.createConnection({
          host: 		'localhost',
          user:			'root',
          password:	'Amir45625!',
          database:	'node'
        });
      connection.connect(function(error){
       if(error){
         console.log('Error');
       } else {
         console.log('Connected');
       }
      });
      this.connection = connection;
};

db.prototype.query = function (query, callback) {

  // console.log(this.connection);

      if(query && this.connection){
        this.connection.query(query, callback);
      } else {
        // throw error;
      }

};

db.prototype.end = function () {
  console.log('End');
      // if(this.connection){
        this.connection.end();
      // } else {
        // throw error
      // }

};




module.exports = new db();
 //
 //  exports.connection = function() {
 //
 // };
