"use strict";
const handlers = require("./handlers");
exports.plugin = {
    register: async (server) => {
        server.route([
            {
                method: 'GET',
                path: '/create/{number}',
                options: handlers.sessionCreate
            },
            {
                method: 'GET',
                path: '/qrcode/{number}',
                options: handlers.sessionQrcode
            }
        ]);
    },
    name: "session",
  };