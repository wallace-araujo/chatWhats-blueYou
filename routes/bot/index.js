"use strict";
const handlers = require("./handlers");
exports.plugin = {
    register: async (server) => {
        server.route([
            {
                method: 'POST',
                path: '/create',
                options: handlers.botCreate
            }
        ]);
    },
    name: "auto reposta",
  };