// person.js
'use strict';

const os = require('os');
const fs = require('fs');
const path = require('path');
const venom = require('venom-bot');
const axios = require('axios');
const Whats= require("../../models/SessionsWhats");
const BotWhats= require("../../models/BotWhats");
const WebhookWhats= require("../../models/WebhookWhats");
const whatServices = require("../bd/insert");
const WebHooks = require('node-webhooks')

module.exports = class Sessions {
    static async startChat() {
        await this.onMsgBot();
        await this.onWebhook();
        const rownsWhats = await  Whats.findAll({where: {activated: 1}});
        rownsWhats.map((line) =>{
            //console.log(line.nameSessions)
            this.start(line.nameSessions)
        });
    }
    static async onMsgBot() {
        Sessions.botMsg = [];
        const rownsBotWhats= await  BotWhats.findAll({where: {activated: 1}});
        rownsBotWhats.map((line) =>{
            Sessions.botMsg[line.nameSessions] = JSON.parse(line.botJson) 
        });
    }

    static async onWebhook() {
        Sessions.webHooks = [];
        Sessions.webHooks = new WebHooks({db: {}})
        const hooks = {}
        const rownsWebhook= await  WebhookWhats.findAll({where: {activated: 1}});
        rownsWebhook.map((line) =>{
            Sessions.webHooks.add(line.nameSessions, line.url)
        });
    }

    static async setWebhook(payload) {
        let webhook = await WebhookWhats.findOne({ where: { nameSessions: payload.number, activated: 1} });
        if(webhook){
            webhook.url = payload.webhook
            webhook.save();
        }else{
            whatServices.setWebhookWhats(payload); 
        }
        Sessions.webHooks.add(payload.number, payload.webhook)
    }

    // static async Testesetwebhook() {
    //     console.log('teste 0001')
    //     Sessions.webHooks.trigger('5511956194230', {data: 123})
    // }

    static async UpdateMsgBot(payload) {
        Sessions.botMsg=  Sessions.botMsg|| []; //start array
        let botUser = await BotWhats.findOne({ where: { nameSessions: payload.number, activated: 1} });
        if(botUser){
            botUser.botJson = JSON.stringify(payload.botMsg)
            botUser.save();
        }else{
            whatServices.createBotWhats(payload); 
        }
        Sessions.botMsg[payload.number] =  payload.botMsg
    }
    
    static async start(sessionName, options = []) {
        Sessions.options = Sessions.options || options; //start object
        Sessions.sessions = Sessions.sessions || []; //start array

        var session = Sessions.getSession(sessionName);
        if (session == false) { 
            //create new session
            session = await Sessions.addSesssion(sessionName);
        } else if (["CLOSED"].includes(session.state)) { //restart session
            console.log("session.state == CLOSED");
            session.state = "STARTING";
            session.status = 'notLogged';
            session.client = Sessions.initSession(sessionName);
            Sessions.setup(sessionName);
        } else if (["CONFLICT", "UNPAIRED", "UNLAUNCHED"].includes(session.state)) {
            // console.log("client.useHere()");
            session.client.then(client => {
                client.useHere();
            });
        } else {
            console.log("session.state: " ,session.state);
        }
        return session;
    } //start

    // START onMessage
    static async onMessage(client) {
        client.onMessage( async (message) => {
            console.log('message-->',message)
            if (message.isGroupMsg === false && Sessions.botMsg[client.session].hasOwnProperty(message.body.toUpperCase())) {
                client.sendText(message.from, Sessions.botMsg[client.session][message.body.toUpperCase()]);
            }else if(message.isGroupMsg === false){
                client.sendText(message.from, Sessions.botMsg[client.session].default);
            }
            Sessions.webHooks.trigger(client.session, {data: message.body})
        });
    }
    static async onTyping(client,number,type){
        console.log('number-->',number)
        if(type){
            await client.startTyping(number);
        }else{
            await client.stopTyping(number);
        }
    }
    // END onMessage

    static async addSesssion(sessionName) {
        var newSession = {
            name: sessionName,
            qrcode: false,
            client: false,
            status: 'notLogged',
            state: 'STARTING'
        }
        Sessions.sessions.push(newSession);
        // console.log("newSession.state: " + newSession.state);
        //setup session
        newSession.client =  Sessions.initSession(sessionName);
        Sessions.setup(sessionName);
        return newSession;
    } //addSession

    static async initSession(sessionName) {
        var session = Sessions.getSession(sessionName);
        session.browserSessionToken = null;
        const tokenUser = await Whats.findOne({ where: { nameSessions: sessionName, activated: 1} });
        if(tokenUser){
            session.browserSessionToken = JSON.parse(tokenUser.sessionsJson)
        }
        const client = await venom.create(
            sessionName,
            (base64Qr) => {
                session.state = "QRCODE";
                session.qrcode = base64Qr;
                //console.log("new qrcode updated - session.state: --??? ", session.state);
            },
            (statusFind) => {
                session.status = statusFind;
                //console.log("session.status: " + session.status);
            }, {
            headless: true,
            devtools: false,
            useChrome: false,
            debug: false,
            logQR: false,
            browserArgs: [
                '--log-level=3',
                '--no-default-browser-check',
                '--disable-site-isolation-trials',
                '--no-experiments',
                '--ignore-gpu-blacklist',
                '--ignore-certificate-errors',
                '--ignore-certificate-errors-spki-list',
                '--disable-gpu',
                '--disable-extensions',
                '--disable-default-apps',
                '--enable-features=NetworkService',
                '--disable-setuid-sandbox',
                '--no-sandbox',
                // Extras
                '--disable-webgl',
                '--disable-threaded-animation',
                '--disable-threaded-scrolling',
                '--disable-in-process-stack-traces',
                '--disable-histogram-customizer',
                '--disable-gl-extensions',
                '--disable-composited-antialiasing',
                '--disable-canvas-aa',
                '--disable-3d-apis',
                '--disable-accelerated-2d-canvas',
                '--disable-accelerated-jpeg-decoding',
                '--disable-accelerated-mjpeg-decode',
                '--disable-app-list-dismiss-on-blur',
                '--disable-accelerated-video-decode',
            ],
            refreshQR: 15000,
            autoClose: 60 * 60 * 24 * 365, //never
            disableSpins: true,
            disableWelcome:true,
            updatesLog:false,
            createPathFileToken:false
        },
            session.browserSessionToken
        );
        return client;
    } //initSession

    static async setup(sessionName) {
        var session = Sessions.getSession(sessionName);
        console.log("sessionName na nuvem...session----",session);

        await session.client.then(client => {
            client.onStateChange(state => {
                session.state = state;
                if (state == "CONNECTED") {
                        setTimeout(async () => {
                            console.log("gravando token na nuvem...");
                            if(session.qrcode){
                                const browserSessionToken = await client.getSessionTokenBrowser();
                                var data = JSON.stringify(browserSessionToken);
                                let dataBd = {
                                    name:sessionName,
                                    sessions:data,
                                }
                                whatServices.createSession(dataBd,1); 
                                session.qrcode = false
                            }
                        }, 2000);
                }//if CONNECTED
                //console.log("session.state: " + state);
            }); //.then((client) => Sessions.startProcess(client));
            //ouvinte..
            this.onMessage(client,sessionName);
        });
    } //setup

    static async restartSession(sessionName) {
        var session = Sessions.getSession(sessionName);
        if (session) {
             await Sessions.closeSession(sessionName);
            Sessions.start(sessionName);
            return { result: "success" };
        } else {
            return { result: "error", message: "NOTFOUND" };
        }
    }
    static async closeSession(sessionName) {
        var session = Sessions.getSession(sessionName);
        if (session) { //só adiciona se não existir
            if (session.state != "CLOSED") {
                if (session.client)
                    await session.client.then(async client => {
                        try {
                            await client.close();
                        } catch (error) {
                            console.log("client.close(): " + error.message);
                        }
                        session.state = "CLOSED";
                        session.client = false;
                        //console.log("client.close - session.state: " + session.state);
                    });
                return { result: "success", message: "CLOSED" };
            } else { //close
                return { result: "success", message: session.state };
            }
        } else {
            return { result: "error", message: "NOTFOUND" };
        }
    } //close

    static getSession(sessionName) {
        var foundSession = false;
        if (Sessions.sessions)
            Sessions.sessions.forEach(session => {
                if (sessionName == session.name) {
                    foundSession = session;
                }
            });
        return foundSession;
    } //getSession

    static getSessions() {
        if (Sessions.sessions) {
            return Sessions.sessions;
        } else {
            return [];
        }
    } //getSessions

    static async getQrcode(sessionName) {
        var session = Sessions.getSession(sessionName);
        if (session) {
            //if (["UNPAIRED", "UNPAIRED_IDLE"].includes(session.state)) {
            if (["UNPAIRED_IDLE"].includes(session.state)) {
                //restart session
                await Sessions.closeSession(sessionName);
                Sessions.start(sessionName);
                return { result: "error", message: session.state };
            } else if (["CLOSED"].includes(session.state)) {
                Sessions.start(sessionName);
                return { result: "error", message: session.state };
            } else { //CONNECTED
                if (session.status != 'isLogged') {
                    return { result: "success", message: session.state, qrcode: session.qrcode };
                } else {
                    return { result: "success", message: session.state };
                }
            }
        } else {
            return { result: "error", message: "NOTFOUND" };
        }
    } //getQrcode

    static async sendText(sessionName, number, text) {
        var session = Sessions.getSession(sessionName);
        if (session) {
            if (session.state == "CONNECTED") {
                var resultSendText = await session.client.then(async client => {
                    return await client.sendText(number + '@c.us', text);
                });
                return { result: "success" }
            } else {
                return { result: "error", message: session.state };
            }
        } else {
            return { result: "error", message: "NOTFOUND" };
        }
    } //message

    // static async sendFile(sessionName, number, base64Data, fileName, caption) {
    //     var session = Sessions.getSession(sessionName);
    //     if (session) {
    //         if (session.state == "CONNECTED") {
    //             var resultSendFile = await session.client.then(async (client) => {
    //                 var folderName = fs.mkdtempSync(path.join(os.tmpdir(), session.name + '-'));
    //                 var filePath = path.join(folderName, fileName);
    //                 fs.writeFileSync(filePath, base64Data, 'base64');
    //                 console.log(filePath);
    //                 return await client.sendFile(number + '@c.us', filePath, fileName, caption);
    //             }); //client.then(
    //             return { result: "success" };
    //         } else {
    //             return { result: "error", message: session.state };
    //         }
    //     } else {
    //         return { result: "error", message: "NOTFOUND" };
    //     }
    // } //message


    // Profile Functions



}