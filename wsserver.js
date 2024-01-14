import { WebSocketServer } from "ws";
import { randomUUID } from 'crypto';

const WSServer = (function( ){

    let wss;
    const users = { };

    const createUser = ( socket ) => {
        const id = randomUUID( );
        users[id] = { socket, name: null, id }
        return users[id];
    }


    return {

        create: function( config ) {
            wss = new WebSocketServer( config );

            wss.on('connection', function(ws) {
                const user = createUser( ws );
                console.log('%s connected', user.id );
                ws.on('error', console.error );
                ws.on('message', data => {
                    if( !data ) return;
                    const message = JSON.parse(data);
                    message.sender = user.id;
                    switch( message.route ) {
                        case 'register': 
                            user.name = message.data;
                            const { name, id } = user;
                            ws.send(JSON.stringify({type: 'register', route: 'register', data: {name, id}}));
                        break;
                        case 'broadcast': 
                            for(const key in users) {
                                if( key == user.id ) continue;
                                else users[key].socket.send( JSON.stringify(message) );
                            }
                        break;
                        case 'whisper':
                            if( users[message.data.recipient]) {
                                users[message.data.recipient].socket.send(JSON.stringify(message));
                            }
                        break;
                    }
                });
            });
        },
    }

})( );

export {WSServer};