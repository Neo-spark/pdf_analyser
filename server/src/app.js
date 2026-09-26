const express = require('express');
const cores = require('cors');
const 

const app=express();
app.use(express.json());
app.use(cores());   //enable CORS for all routes


module.exports = app;