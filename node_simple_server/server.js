const express = require('express');
const http = require('http');
const xml2js = require('xml2js');

const app = express();
const port = 8081;

app.get('/', (req, appRes) => {
	http.get('http://www.cbr.ru/scripts/XML_daily.asp', httpRes => {
		console.log(`Status: ${appRes.statusCode}`);
		let str = '';
		httpRes.on('data', chunk => {
			str += chunk;
		});
		httpRes.on('end', () => {
			xml2js.parseString(str, (err, parseRes) => {
				let code = parseRes.ValCurs.Valute[10].CharCode[0];
				let value = parseRes.ValCurs.Valute[10].Value[0];
				appRes.send(`1 ${code} = ${value}`);
			});
		});
	});
});

let server = app.listen(port, () => {
	let host = server.address().address;
	let port = server.address().port;  
	console.log(`Example app listening at ${host} ${port}`);
});
