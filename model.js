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
    name: String,
    number: Number
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