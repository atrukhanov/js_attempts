const express = require('express');
const https = require('https');
const cheerio = require("cheerio");

const app = express();
const port = 8081;

const phLink = 'https://picsum.photos/200';
const cbLink = 'https://www.cbr.ru/scripts/XML_daily.asp';
const code = 'R01235';

const getData = (link, callback) => {
	https.get(link, httpsRes => {
		let data = '';
		httpsRes.on('data', chunk => {
			data += chunk;
		});
		httpsRes.on('error',err => {
			console.log(err);
		});
		httpsRes.on('end', () => {
			callback(data);
		});
	});
}

app.get('/', (req, appRes) => {
	getData(cbLink, data => {
		let $ = cheerio.load(data, {xmlMode: true});
		let vlt = $(`Valute[ID="${code}"]`);
		let val = `<div>1${vlt.find('CharCode').text()}</div>
					<div>${vlt.find('Value').text()}</div>
					<div>
						<iframe 
							src="${phLink}"
							scrolling="no"
							style="overflow:hidden; border:none;">
						</iframe>
					</div>`;
		appRes.send(val);
	});
});

let server = app.listen(port, () => {
	let host = server.address().address;
	let port = server.address().port;
	console.log(`Example app listening at ${host} ${port}`);
});
