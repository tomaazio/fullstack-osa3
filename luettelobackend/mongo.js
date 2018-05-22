const mongoose = require('mongoose')

const url = 'mongon url tulee tähän'

mongoose.connect(url)

const Person = mongoose.model('Person', {
  name: String,
  number: String
})

if (process.argv[2]) {
  const person = new Person({
    name: process.argv[2],
    number: process.argv[3]
  })

  person
    .save()
    .then(res => {
      console.log('lisättiin henkilö', person.name, 'numero', person.number, 'luetteloon')
      mongoose.connection.close()
    })

} else {
  Person
    .find({})
    .then(result => {
      console.log('puhelinluettelo:')
      result.forEach(person => {
        console.log(person.name, person.number)
      })
      mongoose.connection.close()
    })
}
