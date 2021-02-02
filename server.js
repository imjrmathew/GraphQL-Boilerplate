const express = require('express');
const {graphqlHTTP} = require('express-graphql');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authschema = require('./schema/auth');
const productschema = require('./schema/product');
const verifyjwt = require('./schema/token');
const app = express();
dotenv.config();

mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true}, () => console.log("Database Connected"));

app.use('/auth', graphqlHTTP({
    schema: authschema,
    graphiql: true
}))

app.use('/product', verifyjwt, graphqlHTTP({
    schema: productschema,
    graphiql: true
}))


app.listen(4000, () => console.log("Server is up and running"));