require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./model');
const app = express();
app.use(cors());
app.use(express.static('dist'));
app.use(express.json());

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

app.use(morgan(customLogger));

app.get('/api/persons', (req, res) => {
    Person.find({}).then(result => res.json(result))
})

app.get('/info', (req, res) => {
    const nowDate = new Date();
    Person.countDocuments().then(data => {
        const html = `<div>
            <p>Phonebook has info for ${data} people</p>
            <p>${nowDate.toISOString()}</p>
        </div>`;
        res.send(html);
    });
})

app.get('/api/persons/:id', (req, res, next) => {
    const { id } = req.params;

    Person.findById(id).then(rtnObj => {
        if (rtnObj)
            return res.json(rtnObj)
        res.status(404).end();
    }).catch(err => {
        next(err);
    })
})

app.delete('/api/persons/:id', (req, res, next) => {
    const { id } = req.params;
    Person.findByIdAndDelete(id)
        .then(result => res.status(202).send(result))
        .catch(err => next(err))
})

app.post('/api/persons', (req, res) => {
    const { name, number } = req.body;
    if (!name || !number)
        return res.status(400).json({ error: 'content is missing' })

    const newPerson = new Person({
        ...req.body
    });
    newPerson.save().then(result => {
        res.json(result)
    })
})

app.put('/api/persons/:id', (req, res) => {
    const { id } = req.params;
    Person.findByIdAndUpdate(id, req.body, { new: true })
        .then(result => res.json(result));
})

const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint' });
}

app.use(unknownEndpoint);

const errorHandler = (err, req, res, next) => {
    console.log(err.message);
    if (err.name == 'CastError') {
        return res.status(400).send({ error: 'malformatted ud' })
    }

    next(err)
}

app.use(errorHandler);

module.exports = app