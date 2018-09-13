const express = require('express'); // import express
const app = express(); // ใช้ฟังก์ชั่นใน express
const port = 3000;
const userDB = require('./db'); //ใช้ database จากไฟล์ json
const bodyParser = require('body-parser');// user html body 
const fs = require('fs'); //file system 
const cors = require('cors');

app.use(cors({
    'allowedHeaders': ['sessionId', 'Content-Type'],
    'exposedHeaders': ['sessionId'],
    'origin': '*',
    'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
    'preflightContinue': false
  }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.listen(port, () => console.log('Web Api running on port \nlocalhost:'+port));

app.get('/key/:key',(req,res)=>{
    if(userDB.find(user => user.key === req.params.key))
    {
        res.json(userDB.find(user => user.key === req.params.key));
    }
    else
    {
        res.json(null);
    }
});

app.get('/user/:user',(req, res)=>{
    if(req.params.user == "all"){
        res.json(userDB);
        
    }
    else{
        res.json(userDB.find(user => user.user === req.params.user));
    }
});

app.post('/user',(req,res)=>{
    if(userDB.find(user => user.user === req.body.user))
    {
        console.log("Data already Exits");
        res.send("Data already Exist");
    }
    else
    {
        userDB.push(req.body);
        var writebackDB = JSON.stringify(userDB);
        fs.writeFile('db.json', writebackDB, 'utf8');
        
        res.status(201).json(req.body);
    }
});

app.put('/user/:user',(req,res)=>{
    const updateIndex = userDB.findIndex(user => user.user === req.params.user);
    console.log(updateIndex);
    if(updateIndex < 0 )
    {
        res.send("No data");
    }
    else
    {
        var writebackDB = Object.assign(userDB[updateIndex],req.body);
        writebackDB = JSON.stringify(Object.assign(userDB,writebackDB));
        fs.writeFile('db.json', writebackDB, 'utf8');     

        res.json(userDB);
    }
});

app.delete('/user/:id', (req, res) => {
    const deletedIndex = userDB.findIndex(user => user.user === req.params.id);
    console.log(deletedIndex);
    if(deletedIndex < 0)
    {
        res.send("No data");
    }
    else
    {
        userDB.splice(deletedIndex,1);
        var writebackDB = userDB;
        console.log(writebackDB);
        writebackDB = JSON.stringify(writebackDB);
        fs.writeFile('db.json',writebackDB,'utf8');
        res.json(userDB);
    }

 })
 