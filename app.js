const express = require('express');
const graphqlHttp = require('express-graphql');

const app = express();

app.use('/graphql', graphql(
    {

    }
))
app.listen(3000, () => {
    console.log('server started')
});