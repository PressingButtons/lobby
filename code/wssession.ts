interface SocketMessage {
    route: string; type: string; data: any
}

export class WSSession {

    private static socket: WebSocket;

    private constructor( ) {

    }

    private static send( route: string, type: string, data: any ): Promise<string> {
        return new Promise((resolve, reject) => {
            // check for open connection 
            if( this.socket.readyState == 0 ) 
                reject('Socket is not opened');
            // create listener for route
            const listener: EventListener = (event:MessageEvent) => {
                const message = JSON.parse(event.data) as SocketMessage;
                if( message.route == route ) {
                    this.socket.removeEventListener('message', listener);
                    resolve(event.data);
                }
            }
            // send message 
            this.socket.addEventListener('message', listener);
            this.socket.send(JSON.stringify({route, type, data}));
        });
    }

    public static open( url: string ) {
        return new Promise((resolve, reject) => {
            this.socket = new WebSocket( url );
            this.socket.onopen = event => {
                resolve( 'socket connection successful' );
            }
            this.socket.onerror = event => {
                reject( 'socket connection unsuccessful');
            }
        });
    }

    public static register( name: string ) {
        return this.send('register', 'register', name );
    }

    public static broadcast( type: string, data: any ) {
        return this.send('broadcast', type, data );
    }

    public static whisper( type: string, recipient: string, data: any ) {
        return this.send('whisper', type, Object.assign(data, {recipient}));
    }

    public static on( route: string, method: Function ) {
        WSSession.socket.addEventListener( 'message', (event: MessageEvent ) => {
            const message = JSON.parse(event.data);
            if( message.type == route ) method( message );
        });
    }

}