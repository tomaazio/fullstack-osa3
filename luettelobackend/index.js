const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')


app.use(express.static('build'))
app.use(cors())

morgan.token('body', (req) => {
  return JSON.stringify(req.body)
})

app.use(bodyParser.json())
app.use(morgan(':method :url :body :status :res[content-length] - :response-time ms'))

const format = (person) => {
  return {
    name: person.name,
    number: person.number,
    id: person._id
  }
}

//RESTUL APIs ----

app.get('/api/persons', (req, res) => {
  Person
    .find({}, {_v: 0})
    .then(persons => {
      res.json(persons.map(format))
    })
    .catch(error => {
      console.log(error)
    })
})

app.get('/api/persons/:id', (req, res) => {
  Person
    .findById(req.params.id)
    .then(person => {
      res.json(format(person))
    })
    .catch(error => {
      console.log(error)
    })
})

app.get('/info', (req, res) => {
  Person
    .find({})
    .then(persons => {
      res.send(`<p>puhelinluettelossa on ${persons.length} henkilön tiedot</p> <p>${new Date()}</p>`)
    })
    .catch(error => {
      console.log(error)
    })
})

app.delete('/api/persons/:id', (req, res) => {
  const id = req.params.id
  Person
    .findByIdAndDelete(id)
    .then(result => {
      console.log('poistettu', result.name)
    })
    .catch(error => {
      console.log(error)
      res.status(404).end()
    })
  res.status(204).end()
})

app.post('/api/persons/', (req, res) => {
  const body = req.body
  if (body.name === undefined) {
    return res.status(400).json({error: 'name missing'})
  } else if (body.number === undefined) {
    return res.status(400).json({error: 'number missing'})
  }

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person
    .save()
    .then(savedPerson => {
      res.json(format(savedPerson))
    })
    .catch(error => {
      console.log(error)
    })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`)
})
