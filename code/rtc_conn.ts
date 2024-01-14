export class RTCConnection {

    private static WS: WebSocket;
    private static ID: string;

    private static send( type: string, data: any, id: string = '*') {
        this.WS.send(JSON.stringify({ type, data, from: this.ID, to: id }))
    }

    public static async open( url: string ) {
        this.WS = new WebSocket( url ); 
        this.WS.onopen = (event: MessageEvent) => {
            this.ID = event.data;
        }  
    }

    public static create( config ) {
        return new RTCConnection( config );
    }

    private _conn: RTCConnection;
    private _peers: {[key:string]: string}
    private _whoami: { name: string, id: string }

    private constructor( config ) {
        this._conn = new RTCConnection(config);
        RTCConnection.WS.addEventListener('message', this._onmessage.bind(this));
    }

    private _ongreet( message: {type: string, data: any} ) {
        if( this._peers[message.data] == null ) {
            this._peers[message.data] = message.data;
            RTCConnection.send('greet', null, message.data);
        }
    }

    private _onmessage( event: MessageEvent ) {
        switch( event.data.type ) {
            case 'greet': this._ongreet( event.data ); break;
        }

    }

}