const Whats = require("../../models/SessionsWhats");
const BotWhats = require("../../models/BotWhats");
const WebhookWhats = require("../../models/WebhookWhats");

const createSession = async (response,id) => {
    const log = {
        nameSessions: response.name,
        sessionsJson: response.sessions,
        idUser: id,
        number:response.number
    };
    Whats.create(log);
};

const createBotWhats = async (response) => {
    const log = {
        nameSessions: response.number,
        botJson: JSON.stringify(response.botMsg)
    };
    BotWhats.create(log);
};


const setWebhookWhats = async (response) => {
    const log = {
        nameSessions: response.number,
        url: response.webhook
    };
    WebhookWhats.create(log);
};

module.exports = {
    createSession,
    createBotWhats,
    setWebhookWhats
};
