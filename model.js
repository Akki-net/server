const mongoose = require('mongoose');

mongoose.set('strictQuery', false);
const url = process.env.MONGO_URL
mongoose.connect(url)
    .then(result => {
        console.log("database is connected");
    }).catch(err => {
        console.log(`error: ${err.message}, while database is connecting.`);
    })

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'name is mandatory'],
        minLength: 3
    },
    number: {
        type: Number,
        required: [true, 'number is mandatory'],
        validate: {
            validator: function(v) {
                return /^\d{10}$/.test(v);
            },
            message: props => `${props.value} is not a valid phone number!`
        }
    }
});

personSchema.set('toJSON', {
    transform: (document, returnedObj) => {
        returnedObj.id = returnedObj._id.toString();
        delete returnedObj.__v;
        delete returnedObj._id;
    }
})

const Person = mongoose.model('Person', personSchema);

module.exports = Person