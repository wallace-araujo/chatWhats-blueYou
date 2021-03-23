'use strict';
const Sessions = require('../../services/sessions')
const pattern = /^([55]{2})+[0-9]{11}?$/;
const Joi = require('joi');

module.exports.sessionCreate = {
    auth: 'simple',
    description: "Iniciando API",
    // notes: ' Iniciando API',
    tags: ['api'],
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
        let session = await Sessions.start(req.params.number);
        const data = {
            ...req.params,
            state:session.state
        }
        return data;
    }
}
module.exports.sessionQrcode = {
    auth: 'simple',
    description: "Obter QrCode",
    tags: ['api'],
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
    handler: async (req, h) => {
        //img ou base64
        let session = await Sessions.getQrcode(req.params.number)
        if(session.qrcode){
            session.qrcode = session.qrcode.replace('data:image/png;base64,', '');
            const imageBuffer = Buffer.from(session.qrcode, 'base64');
           return h.response(imageBuffer).type('image/png').bytes(imageBuffer.length).code(200);
        }else{
            return {
                ...req.params,
                state:session.message
            }
        }

    }

}

module.exports.sessionDisconnect= {
    auth: 'simple',
    description: "Desconectar API",
    tags: ['api'],
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
    handler: async (req, h) => {
        let session = await Sessions.closeSession(req.params.number);
        return {
            ...req.params,
            ...session.message
        }
    }

}

module.exports.sessionRestart= {
    auth: 'simple',
    description: "Reiniciar Serviço",
    tags: ['api'],
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
    handler: async (req, h) => {
        let session = await Sessions.restartSession(req.params.number);
        return {
            ...req.params,
            ...session.message
        }
    }

}