const express = require('express');
const WebSocket = require('ws');
const cookieParser = require('cookie-parser')
const uuid = require('uuid');
const http = require('http');
const app = express();
const wss = new WebSocket.Server({ noServer: true });

let CLIENTS = new Map();
let SOCKETS = new Map();

app.use(cookieParser());
app.use(express.static('frontend'));

app.get('/login', (req, res) => {
	
	if (req.query.name){
		let id = uuid.v4()
		CLIENTS.set(id, req.query.name);
		res.cookie('id', id);
		res.redirect('chat.html');
	}
	else {
		res.send('login error');
		res.status(401).redirect('/');
	}
});


const server = http.createServer(app);
server.on('upgrade', (req, soc, head) => {
	cookie = req.headers.cookie;
	if (!cookie){
		soc.destroy();
		return;
	}
	wss.handleUpgrade(req, soc, head, (ws) => {
  		wss.emit('connection', ws, req);
	});
  });
wss.on('connection', (ws, req) => {
  let id = cookie.split('=')[1];
  SOCKETS.set(id, ws);
  ws.on('message', (data) => {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        	client.send(CLIENTS.get(id) + ': ' + data);
      }
    });
  });
});
server.listen(8081);

