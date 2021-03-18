'use strict';
const Bcrypt = require('bcrypt');
const Hapi = require('@hapi/hapi');
const Sessions = require('./services/sessions')
const User = require("./models/User");

const validate = async (request, username, password) => {
  const user = await  User.findOne({where: {userName: username}});
    if (!user) {
        return { credentials: null, isValid: false };
    }
    if(user && user.isValid === 0){
      return { credentials: null, isValid: false};
    }
    const type = user.type.split(",");
    if(!type.includes('whatsChats')){
      return { credentials: null, isValid: false};
    }
    const isValid = await Bcrypt.compare(password, user.password);
    const credentials = { id: user.id, name: user.name };
    return { isValid, credentials };
};


const init = async () => {
  Sessions.startChat();
    const server = Hapi.server({
        port: 5000,
        host: 'localhost'
    });
    await server.register(require('@hapi/basic'));
    server.auth.strategy('simple', 'basic', { validate });
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