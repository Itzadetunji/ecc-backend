const { MongoClient } = require("mongodb");

let dbConnection;

module.exports = {
	connectToDb: (cb) => {
		MongoClient.connect(
			"mongodb+srv://itzadetunji:adetunjimay29@ecc.nnqlkbz.mongodb.net/?retryWrites=true&w=majority"
		)
			.then((client) => {
				dbConnection = client.db();
				return cb();
			})
			.catch((err) => {
				console.log(err);
				return cb(err);
			});
	},
	getDb: () => dbConnection,
};
