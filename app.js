const express = require('express');
const morgan = require('morgan');
const app = express();

app.use(express.json());

// function requestLogger(request, response, next) {
//     console.log('path: ', request.path)
//     console.log('method: ', request.method)
//     console.log('body: ', request.body)
//     console.log('---');
//     next()
// }


// app.use(requestLogger);

morgan.token('body', function (req, res) { return JSON.stringify(req.body) })

const customLogger = function (tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms',
      tokens.body(req, res),
    ].join(' ')
  };

// app.use(morgan('tiny'));
app.use(morgan(customLogger));

const persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
];

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/info', (req, res) => {
    const nowDate = new Date();
    const html = `<div>
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${nowDate.toISOString()}</p>
    </div>`;
    res.send(html);
})

app.get('/api/persons/:id', (req, res) => {
    const { id } = req.params;
    const person = persons.find(p => p.id == id);
    if(person)
        return res.json(person);
    res.status(404).end();

})

app.delete('/api/persons/:id', (req, res) => {
    const {id} = req.params;
    const inx = persons.findIndex(p => p.id == id);
    persons.splice(inx, 1);
    res.status(202).end();
})

app.post('/api/persons', (req, res) => {
    const {name, number} = req.body;
    if(!name || !number)
        return res.status(400).json({error: 'some data is missing'})

    const old = persons.find(p => p.name.toLowerCase() == name.toLowerCase());
    if(old)
        return res.status(400).json({error: 'name must be unique'});

    const newPerson = {...req.body, id: Math.floor(Math.random() * 10000)};
    persons.push(newPerson);
    res.json(newPerson);
})

module.exports = app