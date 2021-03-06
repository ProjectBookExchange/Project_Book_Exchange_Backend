
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const bookSchema = new Schema({
  title: {type: String},
  author: {type: String},
  imageUrl: {type: String},
  owner: {type: Schema.Types.ObjectId, ref: 'User'},
  owner_name: {type: String},
  owner_city: {type: String},
  interestedUsers: {type: [Object]},
  borrowedUser: {type: String}
})

const Book = mongoose.model('Book', bookSchema)

module.exports = Book