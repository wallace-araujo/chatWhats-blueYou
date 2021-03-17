"use strict";
const handlers = require("./handlers");
exports.plugin = {
    register: async (server) => {
        server.route([
            {
                method: 'POST',
                path: '/create',
                options: handlers.sessionCreate
                // handler: (request, h) => {
                //     console.log(request.payload)
                //     return 'Hello World! teste';
                // }
            },
            {
                method: 'POST',
                path: '/qrcode',
                options: handlers.sessionQrcode
            }
        ]);
    },
    name: "session",
  };