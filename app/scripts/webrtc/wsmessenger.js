export class WSSession {
    constructor() {
    }
    static send(route, type, data) {
        return new Promise((resolve, reject) => {
            // check for open connection 
            if (this.socket.readyState == 0)
                reject('Socket is not opened');
            // create listener for route
            const listener = (event) => {
                if (event.data.route == route) {
                    this.socket.removeEventListener('message', listener);
                    resolve(event.data);
                }
            };
            // send message 
            this.socket.send(JSON.stringify({ route, type, data }));
        });
    }
    static open(url) {
        return new Promise((resolve, reject) => {
            this.socket = new WebSocket(url);
            this.socket.onopen = event => {
                resolve('socket connection successful');
            };
            this.socket.onerror = event => {
                reject('socket connection unsuccessful');
            };
        });
    }
    static register(name) {
        return this.send('register', 'register', name);
    }
    static broadcast(type, data) {
        return this.send('broadcast', type, data);
    }
    static whisper(type, data) {
        return this.send('whisper', type, data);
    }
}
