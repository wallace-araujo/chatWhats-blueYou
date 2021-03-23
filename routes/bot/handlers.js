const Sessions = require('../../services/sessions')
const pattern = /^([55]{2})+[0-9]{11}?$/;
const Joi = require('joi');

module.exports.botCreate = {
    auth: 'simple',
    description: "Definir fluxo para bauto resposta",
    tags: ['C:Auto-resposta','api'],
    validate: {
      headers: Joi.object({
          'authorization': Joi.string().required()
      }).unknown(),
      payload: Joi.object({
        number: Joi.string().regex(pattern).required(),
        botMsg: Joi.object()
    })
  },
    handler: async (req, h) => {
      await Sessions.UpdateMsgBot(req.payload);
      return { status: "updated successfully" ,...req.payload  }
    }
}
