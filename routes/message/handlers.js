'use strict';
const Sessions = require('../../services/sessions')
const pattern = /^([55]{2})+[0-9]{11}?$/;
const Joi = require('joi');
const HapiSwagger = require('hapi-swagger');




module.exports.setWebhook = {
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

module.exports.sendText = {
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

module.exports.sendFile = {
    auth: 'simple',
    description: "Enviar Arquivo",
    tags: ['B:Envios','api'],
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
            .description('Número que irá receber a arquivo.'),
            base64: Joi.string().required()
            .description('image em base 64 '),
            fileName: Joi.string().required()
            .example('foto.png')
            .description('nome da image.'),
            caption: Joi.string().required()
            .example('👉 Aproveite ao máximo da nossa nova API! 😉')
            .description('texto junto com imagem'),
        })
    },
    handler: async (req, h) => {
        // console.log(req.payload)
        //5511971375101
        const payload = req.payload
        const results = await Sessions.sendFile(payload.number,payload.clientNumber,payload.base64,payload.fileName,payload.caption)
        return {
            ...results,
            ...req.payload
        }
    }
    
}

module.exports.sendLocation = {
    auth: 'simple',
    description: "Enviar Localização",
    tags: ['B:Envios','api'],
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
            .description('Número que irá receber a arquivo.'),
            lat: Joi.string().required()
            .example('-16.6799'),
            lon: Joi.string().required()
            .example('-49.255'),
            caption: Joi.string().required()
            .example('Localização de Curitiba')
        })
    },
    handler: async (req, h) => {
        const payload = req.payload
        const results = await Sessions.sendLocation(payload.number,payload.clientNumber,payload.lat,payload.lon,payload.caption)
        return {
            ...results,
            ...req.payload
        }
    }
    
}

module.exports.sendContact = {
    auth: 'simple',
    description: "Enviar Contato",
    tags: ['B:Envios','api'],
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
            .description('Número que irá receber a arquivo.'),
            contact: Joi.string().regex(pattern).required()
            .example('5511900000000'),
            name: Joi.string().required()
            .example('whats teste'),
        })
    },
    handler: async (req, h) => {
        const payload = req.payload
        const results = await Sessions.sendContact(payload.number,payload.clientNumber,payload.contact,payload.name)
        return {
            ...results,
            ...req.payload
        }
    }
    
}

module.exports.sendLink = {
    auth: 'simple',
    description: "Enviar Link com Preview",
    tags: ['B:Envios','api'],
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
            .description('Número que irá receber a arquivo.'),
            text: Joi.string().required()
            .example('Sistema de Atendimento'),
            link: Joi.string().required()
            .example('https://www.youtube.com/watch?v=26nsBfLXwSQ'),
        })
    },
    handler: async (req, h) => {
        const payload = req.payload
        const results = await Sessions.sendLink(payload.number,payload.clientNumber,payload.text,payload.link)
        return {
            ...results,
            ...req.payload
        }
    }
    
}

// module.exports.sendAudio = {
//     auth: 'simple',
//     description: "Enviar de arquivo de audio (mp3)",
//     tags: ['B:Envios','api'],
//     validate: {
//         headers: Joi.object({
//             'authorization': Joi.string().required()
//         }).unknown(),
//         payload: Joi.object({
//             number: Joi.string().regex(pattern).required()
//             .example('5511900000000')
//             .description('Número do WhatsApp que será usado na conexão.'),
//             clientNumber: Joi.string().regex(pattern).required()
//             .example('5511900000000')
//             .description('Número que irá receber a arquivo.'),
//             base64: Joi.string().required()
//             .description('arquivo de audio em base64'),
//         })
//     },
//     handler: async (req, h) => {
//         const payload = req.payload
//         const results = await Sessions.sendAudio(payload.number,payload.clientNumber,payload.base64)
//         return {
//             ...results,
//             ...req.payload
//         }
//     }
    
// }