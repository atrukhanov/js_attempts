const express = require('express');
const http = require('http');
const app = express();
const xml2js = require('xml2js');

const options = {
  hostname: 'http://www.cbr.ru/scripts/XML_daily.asp',
};

app.get('/', function (req, app_res) {

   	http.get('http://www.cbr.ru/scripts/XML_daily.asp', (res) => {
		console.log(`STATUS: ${res.statusCode}`);
		let str = ' ';
		res.on('data', (chunk) => {
    		str += chunk;
  		});
  		res.on('end', () => {
  			xml2js.parseString(str, function (err, result) {
  				let code = result.ValCurs.Valute[10].CharCode[0];
  				let value = result.ValCurs.Valute[10].Value[0];
  				app_res.send('1' + code + '=' + value);
  			});
  		});
   	}); 
   	
});

let server = app.listen(8081, function () {
	let host = server.address().address;
	let port = server.address().port;  
   	console.log("Example app listening at http://%s:%s", host, port)
});