'use strict';
const Sessions = require('../../services/sessions')
const pattern = /^([55]{2})+[0-9]{11}?$/;
const Joi = require('joi');

module.exports.blockContact = {
    auth: 'simple',
    description: "Bloquear Contato",
    tags: ['D:Ações','api'],
    validate: {
        headers: Joi.object({
            'authorization': Joi.string().required()
        }).unknown(),
        payload: Joi.object({
            number: Joi.string().regex(pattern).required()
            .example('5511900000000')
            .description('Número do WhatsApp que será usado na conexão.'),
            clientNumber: Joi.string().regex(pattern).required()
            .example('5511900000000')
            .description('Número que será bloqueado'),
        })
    },
   // response: {schema: responseModel}
    handler: async (req, h) => {
        let session = await Sessions.blockcontact(req.payload.number,req.payload.clientNumber);
        return {
            ...req.params.number,
            ...session
        };
    }
}

module.exports.unblockContact = {
    auth: 'simple',
    description: "Desbloquear Contato",
    tags: ['D:Ações','api'],
    validate: {
        headers: Joi.object({
            'authorization': Joi.string().required()
        }).unknown(),
        payload: Joi.object({
            number: Joi.string().regex(pattern).required()
            .example('5511900000000')
            .description('Número do WhatsApp que será usado na conexão.'),
            clientNumber: Joi.string().regex(pattern).required()
            .example('5511900000000')
            .description('Número que será bloqueado'),
        })
    },
   // response: {schema: responseModel}
    handler: async (req, h) => {
        let session = await Sessions.unblockContact(req.payload.number,req.payload.clientNumber);
        return {
            ...req.params.number,
            ...session
        };
    }
}


module.exports.getAllChats = {
    auth: 'simple',
    description: "--",
    tags: ['D:Ações','api'],
    validate: {
        params: Joi.object({
            number: Joi.string().regex(pattern).required()
            .example('5511900000000')
            .description('Número do WhatsApp que será usado na conexão.'),
        }),
        headers: Joi.object({
            'authorization': Joi.string().required()
        }).unknown()
    },
   // response: {schema: responseModel}
    handler: async (req, h) => {
        
        let session = await Sessions.getAllChats(req.params.number);
        console.log('session',session)
        return {
            ...req.params.number,
            ...session
        };
    }
}