require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')




const app = express()

app.use(express.static('dist'))
app.use(express.json())



app.use(cors())


morgan.token('person', function getPerson (request) {
  return request.person ? JSON.stringify(request.person) : ''
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :person'))




const infoText = (date, persons) => {
  return (
    `<div>
      <p> 
        Phonebook has info for ${persons.length} people 
      </p>
      <p>
        ${date}
      </p>
    </div>`
  )
}

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/info', (request, response) => {
  const date = Date()
  Person.find({}).then(persons => {
    response.send(infoText(date, persons))
  })
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id).then(person => {
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'content missing'
    })
  }
  Person.findOne({ name: body.name }).then(existingPerson => {
    if (existingPerson) {
      return response.status(400).json({
        error: 'name must be unique'
      })}


    const person = new Person ({
      name: body.name,
      number: body.number,
    })

    request.person = {
      name: body.name,
      number: body.number,
    }


    person.save()
      .then(savedPerson => {
        response.json(savedPerson)
      })
      .catch(error => next(error))
  })
})

app.put('/api/persons/:id', (request, response, next) => {
  const id = request.body.id
  const { name, number } = request.body
  const person = {
    name,
    number,
  }

  Person.findByIdAndUpdate(
    id,
    person,
    { new: true, runValidators: true, context: 'query' }
  )
    .then(person => {
      response.json(person)
    })
    .catch(error => next(error))

})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      console.log(result)
      response.status(204).end()
    })
    .catch(error => next(error))
})



const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.log(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)




const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})