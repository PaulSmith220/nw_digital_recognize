var ctx, cnv, drawing;
function init () {
	cnv = document.getElementById("canvas");
	ctx = cnv.getContext('2d');
	clearCanvas();

	cnv.onmousedown = function(e) {
		drawing = true;
		ctx.moveTo(e.clientX - cnv.offsetLeft, e.clientY - cnv.offsetTop);
	}

	document.body.onmouseup = function() {
		ctx.stroke();
		drawing = false;
	}

	cnv.onmousemove = function(e) {
		if (drawing) {
			ctx.lineTo(e.clientX- cnv.offsetLeft, e.clientY- cnv.offsetTop);
    		ctx.stroke();
		}
	}
}


function clearCanvas() {
	var w = cnv.width;
	cnv.width = 10;
	cnv.width = w;
	ctx.lineWidth = 30;
	ctx.lineJoin = ctx.lineCap = 'round';
}

function saveImage() {
	var tmpCnv = document.createElement("canvas")
	tmpCnv.width = 15;
	tmpCnv.height = 20;
	tmpCnv.getContext("2d").drawImage(cnv, 0,0, 15, 20);

	var data = tmpCnv.toDataURL();
	var name = prompt('Answer', 1);
	if (!name) {
		return;
	}
	$.post("/upload", {
		name: name,
		data: data
	});
}

function testImage() {
	var data = cnv.toDataURL();

	$.post("/test", {
		data: data
	}, function(data) {
		console.log(data);
	});
}

function getNW(callback) {
	$.get("/generate", function(data) {
		console.log(JSON.parse(data));
		if (callback) {
			callback()
		}
	});
}

function trainOnBase(callback) {
	$.get("/train_base", callback );
}

function genTrainData(callback) {
	$.get("/gen_train_data",callback);
}