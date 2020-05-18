const express = require('express');
const https = require('https');
const cheerio = require("cheerio");

const app = express();
const port = 8081;

const phLink = 'https://picsum.photos/200';
const cbLink = 'https://cbr.ru/scripts/XML_daily.asp';
const code = 'R01235';

const getData = (link, callback) => {
	https.get(link, httpsRes => {
		let data = '';
		httpsRes.on('data', chunk => {
			data += chunk;
		})
		.on('error', console.log)
		.on('end', () => {
			callback(data);
		});
	});
}

app.get('/', (req, appRes) => {
	getData(cbLink, data => {
		let $ = cheerio.load(data, {xmlMode: true});
		let node = $(`Valute[ID="${code}"]`);
		let styleIframe = "overflow:hidden; border:none;";
		let rootCurr = node.find('CharCode').text();
		let convertCurr = node.find('Value').text();
		let val = `<div>
			1 ${rootCurr} = ${convertCurr}
			</div>
			<div>
				<iframe
					src="${phLink}"
					scrolling="no"
					style=${styleIframe}>
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
