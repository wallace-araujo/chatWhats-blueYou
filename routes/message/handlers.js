'use strict';
const Sessions = require('../../services/sessions')
const pattern = /^([55]{2})+[0-9]{11}?$/;
const Joi = require('joi');
const HapiSwagger = require('hapi-swagger');

module.exports.sendtext = {
    auth: 'simple',
    description: "Enviar Mensagem",
    tags: ['B:Envios','api'],
    plugins: {
        'hapi-swagger': {
            order: 2
        }
    },
    validate: {
        headers: Joi.object({
            'authorization': Joi.string().required()
        }).unknown(),
        payload: Joi.object({
            number: Joi.string().regex(pattern).required(),
            clientNumber: Joi.string().regex(pattern).required(),
            msg: Joi.string().required()
        })
    },
    handler: async (req, h) => {
        // console.log(req.payload)
        let results = await Sessions.sendText(req.payload.number,req.payload.clientNumber,req.payload.msg);
        return {...results,...req.payload};
    }
    
}

module.exports.setwebhook = {
    auth: 'simple',
    description: "Definir Webhook",
    tags: ['B:Envios','api'],
    validate: {
        headers: Joi.object({
            'authorization': Joi.string().required()
        }).unknown(),
        payload: Joi.object({
            number: Joi.string().regex(pattern).required()
            .example('5511900000000')
            .description('Número do WhatsApp que será usado na conexão.'),
            webhook: Joi.string().required()
            .example('https://www.teste.com.br/webhook.php')
            .description('url para receber msg. ')
        })
    },
    handler: async (req, h) => {
        //console.log(req.payload)
        await Sessions.setWebhook(req.payload)
        return {
            result: "success",
            ...req.payload
        }
    }
    
}


// module.exports.testewebhook = {
//     // auth: 'simple',
//     description: "test",
//     // validate: {
//     //     payload: Joi.object({
//     //         number: Joi.string().regex(pattern).required(),
//     //         webhook: Joi.string().required()
//     //     })
//     // },
//     handler: async (req, h) => {
//         console.log('dfimmmmm',req.payload)
//         return []
//     }
    
// }

// module.exports.teste2webhook = {
//     auth: 'simple',
//     description: "test",
//     handler: async (req, h) => {
//         Sessions.Testesetwebhook() 
//         return []
//     }
    
// }