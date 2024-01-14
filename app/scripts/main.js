var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { WSSession } from "./wssession.js";
window.onload = (event) => __awaiter(void 0, void 0, void 0, function* () {
    yield WSSession.open('ws://10.0.0.104:8080').then(console.log).catch(console.error);
    const whoami = yield WSSession.register('test').then(JSON.parse).then(x => x.data);
    WSSession.on('hello', function (options) {
        const { name, id } = options.data;
        console.log('%s:%s has entered ', name, id);
        WSSession.whisper('hello-response', id, whoami);
    });
    WSSession.on('hello-response', function (message) {
        console.log('greeted by %s:%s', message.data.name, message.data.id);
    });
    WSSession.on('broadcast', function (message) {
        log(message.sender, message.data);
    });
    WSSession.broadcast('hello', whoami);
    const textfield = document.getElementById('text-field');
    textfield.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            WSSession.broadcast('broadcast', textfield.value);
            log(whoami.id, textfield.value);
            textfield.value = '';
        }
    });
    function log(writer, text) {
        const entry = document.createElement('div');
        if (writer == whoami.id)
            entry.classList.add('self');
        entry.innerHTML = `
            <p>${writer}</p>
            <p>${text}</p>
        `;
        document.getElementById('log').append(entry);
    }
});
