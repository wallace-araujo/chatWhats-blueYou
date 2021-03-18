const Sessions = require('../../services/sessions')

module.exports.botCreate = {
    // description: "post cnpj",
    auth: 'simple',
    handler: async (req, h) => {
      await Sessions.UpdateMsgBot(req.payload);
      return { status: "updated successfully" ,...req.payload  }
    }
}

module.exports.botUpdate = {
    // description: "post cnpj",
    handler: async (req, h) => {
        return []
    }
}