import express from 'express';
import {WebSocket, WebSocketServer } from 'ws';
import { engine } from 'express-handlebars';
import { randomUUID } from 'crypto';
import { WSServer } from './wsserver.js';

const app = express( );
const PORT = process.env.PORT || 3000;

const users = { };

app.engine('.hbs', engine({extname: '.hbs'}));
app.set('view engine', '.hbs');

app.use('/app', express.static('./app'))

app.get('/', (req, res) => {
    res.render('index');
});

WSServer.create({port: 8080});

app.listen(PORT, err =>{
    if( err ) throw err;
    console.log('server initialized on port: %s', PORT);
})