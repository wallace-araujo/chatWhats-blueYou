'use strict';
const Sessions = require('../../services/sessions')
const pattern = /^([55]{2})+[0-9]{11}?$/;
const Joi = require('joi');

module.exports.sessionCreate = {
    auth: 'simple',
    description: "create session",
    validate: {
        params: Joi.object({
            number: Joi.string().regex(pattern).required()
        })
    },
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
    description: "Get qr-code",
    validate: {
        params: Joi.object({
            number: Joi.string().regex(pattern).required()
        })
    },
    handler: async (req, h) => {
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