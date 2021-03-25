"use strict";
const handlers = require("./handlers");
exports.plugin = {
    register: async (server) => {
        server.route([
            {
                method: 'POST',
                path: '/sendtext',
                options: handlers.sendText
            },
            {
                method: 'POST',
                path: '/setwebhook',
                options: handlers.setWebhook
            },
            {
                method: 'POST',
                path: '/sendfile',
                options: handlers.sendFile
            },
            {
                method: 'POST',
                path: '/sendlocation',
                options: handlers.sendLocation
            },
            {
                method: 'POST',
                path: '/sendcontact',
                options: handlers.sendContact
            },
            {
                method: 'POST',
                path: '/sendlink',
                options: handlers.sendLink
            }
            // ,{
            //     method: 'POST',
            //     path: '/sendaudio',
            //     options: handlers.sendAudio
            // }
        ]);
    },
    name: "messages",
  };