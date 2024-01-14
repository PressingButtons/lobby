import { WSSession } from "./wssession.js";

window.onload = async( event ) => {
    await WSSession.open('ws://10.0.0.104:8080').then( console.log ).catch( console.error );
    const whoami = await WSSession.register('test').then( JSON.parse ).then( x => x.data );
    WSSession.on('hello', function(options) {
        const {name, id} = options.data;
        console.log('%s:%s has entered ', name, id);
        WSSession.whisper('hello-response', id,  whoami);
    });
    WSSession.on('hello-response', function(message) {
        console.log('greeted by %s:%s', message.data.name, message.data.id)
    });

    WSSession.on('broadcast', function(message) {
        log( message.sender, message.data );
    });

    WSSession.broadcast('hello', whoami );

    const textfield = document.getElementById('text-field') as HTMLInputElement;

    textfield.addEventListener('keyup', (event:KeyboardEvent) => {
        if( event.key === 'Enter') {
            WSSession.broadcast('broadcast', textfield.value);
            log(whoami.id, textfield.value);
            textfield.value = '';
        }
    })


    function log( writer: string, text: string ) {
        const entry = document.createElement('div');
        if( writer == whoami.id ) entry.classList.add('self');
        entry.innerHTML = `
            <p>${writer}</p>
            <p>${text}</p>
        `
        document.getElementById('log').append( entry );
    }
}