const Sessions = require('../../services/sessions')

module.exports.botCreate = {
    description: "update json bot",
    auth: 'simple',
    handler: async (req, h) => {
      await Sessions.UpdateMsgBot(req.payload);
      return { status: "updated successfully" ,...req.payload  }
    }
}
