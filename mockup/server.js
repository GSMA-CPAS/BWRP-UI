'use strict';

const path = require('path');
const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, '/dist')));

app.listen(port, (error) => {
    if (error) {
        console.error('something bad happened', error);
    } else {
        console.log(`server is listening on ${port}`);
    }
});
