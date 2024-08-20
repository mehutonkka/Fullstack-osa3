const express = require('express')
const morgan = require('morgan')
const cors = require('cors')




const app = express()

app.use(express.json())
app.use(express.static('dist'))

app.use(cors())


morgan.token('person', function getPerson (request) {
  return request.person ? JSON.stringify(request.person) : ''
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :person'))

let persons = [
    {
      "name": "Arto Hellas",
      "number": "040-123456",
      "id": "1"
    },
    {
      "name": "Ada Lovelace",
      "number": "39-44-5323523",
      "id": "2"
    },
    {
      "name": "Dan Abramov",
      "number": "12-43-234345",
      "id": "3"
    },
    {
      "name": "Mary Poppendieck",
      "number": "39-23-6423122",
      "id": "4"
    }
  ]


const infoText = (date) => {
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
  response.send(infoText(date))
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })

  const generateId = () => {
    const maxId = persons.length > 0
      ? Math.max(...persons.map(n => Number(n.id)))
      : 0
    return String(maxId + 1)
  }
  
  app.post('/api/persons', (request, response) => {
    const body = request.body
  
    if (!body.name || !body.number) {
      return response.status(400).json({ 
        error: 'content missing' 
      })
    } if (persons.find(person => person.name === body.name)){
      return response.status(400).json({
        error: 'name must be unique'
      })
    }

  
    const person = {
      id: generateId(),
      name: body.name,
      number: body.number,
      
    }

    request.person = person
  
    persons = persons.concat(person)
  
    response.json(person)
  })



app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
    })

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})