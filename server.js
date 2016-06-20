var http = require('http');
var fs = require("fs");
var sys = require('sys');
var Perceptrone = require("./backend/Perceptrone");
var PNG = require('png-js');

var img_base = JSON.parse(fs.readFileSync('images/data.json', 'utf8'));

var NW_Layer = {};

http.createServer(function(request, response) {

	if(request.url === "/index" || request.url === "/"){
		sendFileContent(response, "teach.html", "text/html");
	} 
	else if (request.url === "/upload") {
		  var body = "";
		  var params = {};
		  request.on('data', function (chunk) {
		    body += chunk;
		  });
		  request.on('end', function () {
		    
		    body.split("&").forEach(function(p) {
		    	var x = p.split("=");
		    	params[x[0]] = decodeURIComponent(x[1]);
		    });
		  	
			saveImage(params.data, params.name);
		  })
		  response.end();

	}
	else if (request.url === "/test") {
		  var body = "";
		  var params = {};
		  request.on('data', function (chunk) {
		    body += chunk;
		  });
		  request.on('end', function () {
		    
		    body.split("&").forEach(function(p) {
		    	var x = p.split("=");
		    	params[x[0]] = decodeURIComponent(x[1]);
		    });
		  	
			testImage(params.data, response);
		  })
		  

	}
	else if (request.url === '/generate') {
		var w = 15,
			h = 20;
		response.end(JSON.stringify(generateNW(w, h)));
	}
	else if (request.url === '/gen_train_data') {
		getTrainBase();
	}
	else if (request.url === '/train_base') {
		trainOnBase();
	}
	else if(/^\/[a-zA-Z0-9\/]*.js$/.test(request.url.toString())){
		sendFileContent(response, request.url.toString().substring(1), "text/javascript");
	}
	else if(/^\/[a-zA-Z0-9\/]*.css$/.test(request.url.toString())){
		sendFileContent(response, request.url.toString().substring(1), "text/css");
	}
	else {
		console.log("Requested URL is: " + request.url);
		response.end();
	}


}).listen(3000);
console.log("Server is listening on localhost:3000");

function sendFileContent(response, fileName, contentType){
	fs.readFile("./frontend/" + fileName, function(err, data){
		if(err){
			response.writeHead(404);
			response.write("Not Found!");
		}
		else{
			response.writeHead(200, {'Content-Type': contentType});
			response.write(data);
		}
		response.end();
	});
}


function decodeBase64Image(dataString) {
  var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
    response = {};

  if (matches.length !== 3) {
    return new Error('Invalid input string');
  }

  response.type = matches[1];
  response.data = new Buffer(matches[2], 'base64');

  return response;
}

function saveImage(img, name) {
	var dt = (new Date()).getTime();
	var fname =  name + '_' + dt + ".png";
	
	var imgBuffer = decodeBase64Image(img);

	fs.writeFile("images/" + fname, imgBuffer.data, function(err){});

	img_base[name] = img_base[name] || [];
	img_base[name].push(fname);
	fs.writeFile("images/data.json", JSON.stringify(img_base));

}

function generateNW(w, h) {
 NW_Layer = {};
 Object.keys(img_base).forEach(function(digit) {
 	var p = new Perceptrone("sigma");
 	p.sigmaLimit = 0.7;
 	p.weights = [];
 	for (var i = 0; i < w*h; i++) {
 		p.weights.push(0);
 	}
 	p.name = digit;
 	p.sigmaNormalizator = 300;
 	NW_Layer[digit] = p;
 });
 return NW_Layer;
}

var training_array = [];
function getTrainBase() {
	training_array = [];
	Object.keys(img_base).forEach(function(digit){
		for (var i = 0; i < img_base[digit].length; i++) {
			(function(x) {
				return function() {
					var data = imgToData(img_base[digit][x], function(pix) {
						training_array.push({
							name: digit,
							data: pix
						});
						console.log('img ready ' + img_base[digit][x]);
					});
				}
			})(i)();			

		}
	});
	return training_array;
}

function trainOnBase() {
	console.log('training_array size: ' + training_array.length);
	training_array.forEach(function(item) {
		console.log(Object.keys(NW_Layer).length);
		console.log(Object.keys(NW_Layer));
		Object.keys(NW_Layer).forEach(function(key) {
			var p = NW_Layer[key];
			p.setInputs(item.data);
			var result = p.exec();
			p.correctWeights(item.name == p.name);
			console.log("Digit: " + item.name);
			console.log("Newron " + p.name);
			console.log("Answer: " + (item.name == p.name).toString());
			console.log("\n");
		});
	});

	fs.writeFile("p_array.json", JSON.stringify(NW_Layer));
}


function imgToData(img_path, callback) {
	img_path = "./images/" + img_path;
	console.log("\n#################");
	console.log(img_path);
	PNG.decode(img_path, function(pixels) {
		// divide by 100x100 of bool
		console.log(pixels);
		var result = [];
		for (var i = 0; i < pixels.length; i+=4) {

			if (pixels[i] < 50) {
				result.push(1);
			} else {
				result.push(0);
			}
		}
		callback(result);

	});
}

function testImage(img, response) {
	var fname =  "test.png";
	var imgBuffer = decodeBase64Image(img);
	fs.writeFile(fname, imgBuffer.data, function(err){
	var results = {};
		imgToData("../" + fname, function(data) {
			Object.keys(NW_Layer).forEach(function(key) {
				var p = NW_Layer[key];
				p.setInputs(data);
				results[p.name] = p.exec();
			});
			response.end(JSON.stringify(results));
		});

	});
}