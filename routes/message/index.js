"use strict";
const handlers = require("./handlers");
exports.plugin = {
    register: async (server) => {
        server.route([
            {
                method: 'POST',
                path: '/sendtext',
                options: handlers.sendtext
            }
        ]);
    },
    name: "messages",
  };