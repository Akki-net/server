const mongoose = require('mongoose');

if(process.argv.length < 3) {
    console.log('password is missing!');
    process.exit();
}

const pass = process.argv[2];
const url = `mongodb+srv://akkiwebs:${pass}@akki.hhgpybk.mongodb.net/phoneBook?retryWrites=true&w=majority&appName=Akki`

mongoose.set('strictQuery', false);
mongoose.connect(url)

const argLen = process.argv.length;

const personSchema = new mongoose.Schema({
    name: String,
    number: Number
});

const Person = mongoose.model('Person', personSchema);

if(argLen > 3 && argLen < 5){
    console.log('may name or number be missing!');
    process.exit();
}else if(argLen == 3){
    Person.find({}).then(persons => {
        console.log("phonebook:");
        persons.forEach(p => {
            console.log(p.name, p.number);
        })
        mongoose.connection.close();
    })
}else{
    const newPerson = new Person({
        name: process.argv[3],
        number: parseInt(process.argv[4])
    })
    
    newPerson.save().then((result) => {
        console.log(`added ${result.name} ${result.number} to phonebook`);
        mongoose.connection.close();
    })
}
