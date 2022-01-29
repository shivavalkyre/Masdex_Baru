const fetch = require('node-fetch');

const getBMKGData = (request, response) => {

let url = "https://peta-maritim.bmkg.go.id/public_api/pelabuhan/0004_Tanjung%20Priok.json";

let settings = { method: "Get" };

fetch(url, settings)
    .then(res => res.json())
    .then((json) => {
        // do something with JSON
        //console.log(json)
        response.status(200).send(json)
    });

}

module.exports = {
 getBMKGData
}