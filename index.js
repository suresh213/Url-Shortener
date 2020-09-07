const express = require('express')
const body_parser = require('body-parser')
const mongoose = require('mongoose')
const app = express()
const { urlmodel } = require('./models/urlschema')
const { renderFile } = require('ejs')
app.use(express.static('public'))
app.set('view engine', 'ejs');
app.use(body_parser.urlencoded({ extended: true }))


//db connection
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.connect("mongodb://localhost:27017/myUrlshortener");

app.get('/', (req, res) => {
    let allurl = urlmodel.find((err, result) => {
        if(err){
            throw err
        }
        res.render('home', {
            urlResult: result
        })
    })
})

app.post('/create', (req, res) => {
    //create short url and store in db
    const urlshort = new urlmodel({
        longUrl: req.body.longurl,
        shortUrl: generateshortUrl()
    })
    urlshort.save((err, data) => {
        if (err) {
            throw err;
        }
        res.redirect('/')
    })
})

app.get('/:urlId', (req, res) => {
    urlmodel.findOne({ shortUrl: req.params.urlId }, (err, data) => {
        if (err) {
            throw err;
        }
        urlmodel.findByIdAndUpdate({_id:data.id},{$inc:{clickcount : 1}},(err,updatedData)=>{
            if(err){
                throw err
            }
            res.redirect(data.longUrl)
        })
    })
})

app.get('/delete/:id',(req,res) => {
    urlmodel.findByIdAndDelete({_id:req.params.id},(err,deleteddata)=>{
        if(err){
            throw err;
        }
        res.redirect('/');
    })
})

app.listen(2000, () => {
    console.log('server started')
})


function generateshortUrl() {
    var result = "";
    var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"

    for (i = 0; i < 6; i++) {
        result += characters.charAt(Math.floor(
            Math.random() * characters.length
        ))
    }
    return result
}