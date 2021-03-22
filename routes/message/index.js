"use strict";
const handlers = require("./handlers");
exports.plugin = {
    register: async (server) => {
        server.route([
            {
                method: 'POST',
                path: '/sendtext',
                options: handlers.sendtext
            },
            {
                method: 'POST',
                path: '/setwebhook',
                options: handlers.setwebhook
            }
            // {
            //     method: 'POST',
            //     path: '/teste',
            //     options: handlers.testewebhook
            // },{
            //     method: 'POST',
            //     path: '/teste2',
            //     options: handlers.teste2webhook
            // }
        ]);
    },
    name: "messages",
  };