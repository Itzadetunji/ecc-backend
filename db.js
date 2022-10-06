const { MongoClient } = require('mongodb')

let dbConnection

module.exports = {
  connectToDb: (cb) => {
    // MongoClient.connect('mongodb+srv://itzadetunji:adetunjimay29@mernapp.f11zmes.mongodb.net/?retryWrites=true&w=majority')
    MongoClient.connect('mongodb://127.0.1:27017/waitlist')
      .then((client) => {
        dbConnection = client.db()
        return cb()
      })
      .catch(err => {
        console.log(err)
        return cb(err)
      })
  },
  getDb: () => dbConnection
}