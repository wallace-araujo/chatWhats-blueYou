'use strict';
const Sessions = require('../../services/sessions')
const pattern = /^([55]{2})+[0-9]{11}?$/;
const Joi = require('joi');

module.exports.sessionCreate = {
    description: "create session",
    validate: {
        payload: Joi.object({
            number: Joi.string().regex(pattern)
        })
    },
    handler: async (req, h) => {
        let session = await Sessions.start(req.payload.number);
        const data = {
            ...req.payload,
            state:session.state
        }
        return data;
    }

}
module.exports.sessionQrcode = {
    // description: "post cnpj",
    handler: async (req, h) => {
        let session = await Sessions.getQrcode(req.payload.number)
        // console.log('session',session.message)
        if(session.qrcode){
            session.qrcode = session.qrcode.replace('data:image/png;base64,', '');
            const imageBuffer = Buffer.from(session.qrcode, 'base64');
           return h.response(imageBuffer).type('image/png').bytes(imageBuffer.length).code(200);
        }else{
            return {
                ...req.payload,
                state:session.message
            }
        }

    }

}