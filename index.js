'use strict';
const Hapi = require('@hapi/hapi');
const Sessions = require('./services/sessions')
// const os = require('os');
// const fs = require('fs');
// const path = require('path');
// const venom = require('venom-bot');


const init = async () => {
  Sessions.startChat();
  
    const server = Hapi.server({
        port: 3000,
        host: 'localhost'
    });
    await server.register([
        {
          plugin: require("./routes/session"),
          options: {},
          routes: {
            prefix: "/session",
          },
        },{
          plugin: require("./routes/bot"),
          options: {},
          routes: {
            prefix: "/bot",
          },
        }
    ]);
    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});


init();