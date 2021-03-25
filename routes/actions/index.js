"use strict";
const handlers = require("./handlers");
exports.plugin = {
    register: async (server) => {
        server.route([
            {
                method: 'POST',
                path: '/blockcontact',
                options: handlers.blockContact
            },
            {
                method: 'POST',
                path: '/unblockcontact',
                options: handlers.unblockContact
            },
            {
                method: 'GET',
                path: '/getallchats/{number}',
                options: handlers.getAllChats
            },
        ]);
    },
    name: "actions",
  };