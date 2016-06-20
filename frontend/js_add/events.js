define(["jquery"], function($) {
    return {
        setPer_selectEvent: function() {
            $("#Per_select, #Per_select_elem").on('change', function() {
                var elem = $("#Per_select_elem").val();
                var $mt = $("#memoryTable"),
                    $rows = "<tr>\n",
                    num = parseInt($("#Per_select").val());
                var w_arr = pList[ parseInt($("#Per_select").val())][elem];
                for (var i = 0; i < w_arr.length; i++) {
                    if (i != 0 && i%15 == 0) {
                        $rows += "</tr>\n<tr>";
                    }
                    $rows += "<td data-val='" + (w_arr[i] > 0 ? '1' : (w_arr[i] < 0 ? '-1' : '0')) +  "'>" + w_arr[i] + "</td>\n";

                }

                $rows += "</tr>";

                $mt.html($rows);
                $("#Per_result").html( pList[ parseInt($("#Per_select").val())].result.toString());
            });
            $("#Per_select").trigger('change');
        },
        setCanvasDrawMode: function($cnv) {
            cnv = document.getElementById("canvas");
            ctx = cnv.getContext('2d');
            previewCnv = document.getElementById("preview"),
                previewCtx = previewCnv.getContext("2d");
            cnv.width = 150;
            cnv.height = 200;
            window.drawing = false;

            ctx.imageSmoothingEnabled = false;
            previewCtx.imageSmoothingEnabled = false;

            cnv.onmousedown = function(e) {
                window.drawing = true;
                ctx.moveTo(e.clientX - cnv.offsetLeft, e.clientY - cnv.offsetTop);
            };

            document.body.onmouseup = function() {
                ctx.stroke();
                window.drawing = false;
                drawPreview();
            };

            cnv.onmousemove = function(e) {
                if (window.drawing) {
                    ctx.lineTo(e.clientX- cnv.offsetLeft, e.clientY- cnv.offsetTop);
                    ctx.stroke();
                }
            };

            function drawPreview() {
                previewCnv.width = 2;
                previewCnv.width = 15;
                previewCnv.height = 20;
                previewCtx.imageSmoothingEnabled = false;
                previewCtx.drawImage(cnv, 0, 0, 15, 20);
            }

            $(".draw-block .clear").on('click', function() {
                Canvas.Clear(Canvas);
                drawPreview();
            });

            $(".draw-block .recognize").on('click', function() {
                var data = getBinArray();
                var results = "";
                Object.keys(pList).forEach(function(key) {
                    pList[key].setInputs(data);
                    pList[key].name = key;
                    results += "<div>" + key + ": " + pList[key].exec().toString() + "</div>";
                });
                $("#Per_select_elem").val("inputs");
                $("#Per_select").trigger('change');

                $("#mini-result").html(results);
            });

            var _correcting = false;
            $(".draw-block .correct").on('click', function() {
                if (!_correcting) {
                    _correcting = true;
                    var answer = prompt("Answer: ", 1);
                    console.log("ANswer: " + answer);
                    if (answer) {
                        Object.keys(pList).forEach(function (key) {
                            pList[key].correctWeights(
                                key == answer
                            );
                            console.log(key, answer, key == answer);
                        });

                        $("#Per_select_elem").val("weights");
                        $("#Per_select").trigger('change');
                    }
                    setTimeout(function() {
                        _correcting = false;
                    }, 1000);
                }
            });

            function getBinArray() {
                var data = previewCtx.getImageData(0, 0, 15, 20).data;
                var result = [];
                for (var i = 0; i < data.length-3; i+=4) {
                    color  = data[i+3];
                    result.push(color < 50 ? 0 : 1);
                }
                return result;
            }

            return {
                Context: ctx,
                Element: cnv,
                previewCnv: previewCnv,
                previewCtx: previewCtx,
                Clear: function(C) {
                    var w = cnv.width;
                    cnv.width = 10;
                    cnv.width = w;
                    ctx.lineWidth = 30;
                    ctx.lineJoin = ctx.lineCap = 'round';

                    previewCnv.width = 2;
                    previewCnv.width = 15;
                    previewCtx.imageSmoothingEnabled = false;
                },
                getData: getBinArray
            }
        }
    };
});