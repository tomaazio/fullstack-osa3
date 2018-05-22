const mongoose = require('mongoose')

const url = 'mongon url tähän'

mongoose.connect(url)

const Person = mongoose.model('Person', {
  name: String,
  number: String
})

module.exports = Person
