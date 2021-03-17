"use strict";
const handlers = require("./handlers");
exports.plugin = {
    register: async (server) => {
        server.route([
            {
                method: 'POST',
                path: '/create',
                options: handlers.botCreate
            },
            {
                method: 'POST',
                path: '/update',
                options: handlers.botUpdate
                //  handler: (request, h) => {
                //     //console.log(request.payload)
                //     return 'Hello World!';
                // }
            }
        ]);
    },
    name: "bot",
  };