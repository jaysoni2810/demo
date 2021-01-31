const express = require('express')
const MongoClient = require("mongodb").MongoClient;

const app = express()

app.use(express.json())
app.set('port', 3000)
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
})
// connecting to the mongodb
let db;
MongoClient.connect('mongodb+srv://jay:jay12345@cluster0.hdibi.mongodb.net', (err, client) => {
    db = client.db('webstore');
})
// to show that the messsage is working
app.get('/', (req, res, next) => {
    res.end('Select a collection, e.g., /collection/messages')
})
// listing to the port
app.listen(3000, () => {
    console.log('Express.js server running at localhost:3000')
})
// gets the collectio name 
app.param('collectionName', (req, res, next, collectionName) => {
    req.collection = db.collection(collectionName)
    return next()
})
// retreiving all the information from collection
app.get('/collection/:collectionName', (req, res, next) => {
    req.collection.find({}, {limit: 5, sort: [['price',-1]]}).toArray((e, results) => {
        if (e) return next(e)
        res.send(results)
    })
})
// adding new post
app.post('/collection/:collectionName', (req, res, next) => {
    req.collection.insert(req.body, (e, results) => {
    if (e) return next(e)
    res.send(results.ops)
    })
})
// getting object according to thr object ID
const ObjectID = require('mongodb').ObjectID;
app.get('/collection/:collectionName/:id', (req, res, next) => {
    req.collection.findOne({ _id: new ObjectID(req.params.id) }, (e, result) => {
        if (e) return next(e)
        res.send(result)
    })
})
// update an object
app.put('/collection/:collectionName/:id', (req, res, next) => {
    req.collection.update({_id: new ObjectID(req.params.id)}, {$set: req.body}, {safe: true, multi: false}, (e, result) => {
        if (e) return next(e)
        res.send((result.result.n === 1) ? {msg: 'success'} : {msg: 'error'})
    })
})
// deletes the whole record
app.delete('/collectione/:collectionName/:id', (req, res, next) => {
    req.collection.deleteOne({_id: ObjectID(req.params.id)},
    (e, result) => {
        if (e) return next(e)
        res.send((result.result.n === 1) ? {msg: 'success'} : {msg: 'error'})
    })
})
const port = process.env.PORT || 3000;
app.listen(port,()=>{console.log('express server is running at localhost:3000')
})



