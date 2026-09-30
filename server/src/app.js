const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authentification');
const documentRoutes = require('./routes/documents');

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use('/auth', authRoutes);
app.use('/api/documents', documentRoutes);

module.exports = app;