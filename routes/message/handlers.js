'use strict';
const Sessions = require('../../services/sessions')
const pattern = /^([55]{2})+[0-9]{11}?$/;
const Joi = require('joi');

module.exports.sendtext = {
    auth: 'simple',
    description: "send text msg",
    validate: {
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
    description: "set webhook",
    validate: {
        payload: Joi.object({
            number: Joi.string().regex(pattern).required(),
            webhook: Joi.string().required()
        })
    },
    handler: async (req, h) => {
        console.log(req.payload)
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