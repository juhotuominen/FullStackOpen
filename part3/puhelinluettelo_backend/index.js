const express = require('express')
const morgan = require('morgan')
const cors = require('cors')



const app = express()

morgan.token('postData', (req) => {
    if(req.method === 'POST'){
        return JSON.stringify(req.body)
    }
    return ''
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postData'));
app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

let persons = [
    {
      id: 1,
      name: "Arto Hellas",
      number: "040-123456"
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323523"
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345"
    },
    {
        id: 4,
        name: "Mary Poppendick",
        number: "39-23-6423122"
    }
  ]

const generateID = () => {
    const maxId = persons.length > 0
        ? Math.max(...persons.map(n => n.id))
        : 0
    return maxId + 1
}

app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
})

app.get('/info', (req, res) => {
    res.send("<p>Phonebook has info for " + persons.length + " people <br>" + Date() + "<p>")
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)

    if(person){
        res.json(person)
    }else{
        res.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const body = request.body
    
    if (!body.name) {
        return response.status(400).json({
            error: 'Name missing'
        })
    } else if (!body.number) {
        return response.status(400).json({
            error: "Number missing"
        })
    } else if (persons.some(person => person.name === body.name)) {
        return response.status(400).json({
            error: "Name must be unique"
        })
    }

    const person = {
        id: generateID(),
        name: body.name,
        number: body.number,
    }

    persons = persons.concat(person)

    response.json(person)
})



const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
