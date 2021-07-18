const ngrok = require('ngrok');
const restify = require("restify");
const firebase = require("./src/firebase/firestore");
const server = restify.createServer();
const fs = require('fs');
const users = require("./src/firebase/users.json");
const dateFormat = require("dateformat");
require("dotenv").config();

ngrok.authtoken(process.env.ngrokToken).then(v => {
    ngrok.connect(process.env.serverPort).then(url => {
        console.log("Public apiHost: " + url);
        firebase.setApiHost(url);
    })
});
server.use(restify.plugins.bodyParser({ mapParams: false }));
server.listen(process.env.serverPort);

server.post("/singup", (req, res) => {
    try {
        console.log(getDate() + ": requested /singup");
        for (var i = 0; i < users.length; i++) {
            if (req.body.email.toLowerCase() == users[i].email.toLowerCase()) {
                res.send({ success: false, message: "Usuario já está cadastrado." });
                return;
            }
        }
        users.push(req.body);
        fs.writeFileSync("./src/firebase/users.json", JSON.stringify(users));
        res.send({ success: true, message: "Cadastrado com sucesso.", user: users[i] });
    } catch (error) {
        res.send(500, { success: false, message: error });
    }

});

server.post("/singin", (req, res) => {
    try {
        console.log(getDate() + ": requested /singin");
        for (var i = 0; i < users.length; i++) {
            if (req.body.email.toLowerCase() == users[i].email.toLowerCase()) {
                if (req.body.password !== users[i].password) {
                    res.send({ success: false, message: "Senha incorreta." });
                    return;
                } else {
                    res.send({ success: true, message: "Login bem sucedido.", user: users[i] });
                    return;
                }
            }
        }
        res.send({ success: false, message: "Usuário não encontrado no sistema.", user: {} });
    } catch (error) {
        res.send(500, { success: false, message: error });
    }

});

server.get("/users", (req, res) => {
    console.log(getDate() + ": requested /users");
    res.send(users);
})

function getDate() {
    var now = new Date();
    return dateFormat(now, "dd/MM/yyyy HH:MM:ss");
}