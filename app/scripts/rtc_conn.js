var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export class RTCConnection {
    static send(type, data, id = '*') {
        this.WS.send(JSON.stringify({ type, data, from: this.ID, to: id }));
    }
    static open(url) {
        return __awaiter(this, void 0, void 0, function* () {
            this.WS = new WebSocket(url);
            this.WS.onopen = (event) => {
                this.ID = event.data;
            };
        });
    }
    static create(config) {
        return new RTCConnection(config);
    }
    constructor(config) {
        this._conn = new RTCConnection(config);
        RTCConnection.WS.addEventListener('message', this._onmessage.bind(this));
    }
    _ongreet(message) {
        if (this._peers[message.data] == null) {
            this._peers[message.data] = message.data;
            RTCConnection.send('greet', null, message.data);
        }
    }
    _onmessage(event) {
        switch (event.data.type) {
            case 'greet':
                this._ongreet(event.data);
                break;
        }
    }
}
