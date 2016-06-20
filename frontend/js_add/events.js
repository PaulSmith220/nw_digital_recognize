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
                    $rows += "<td data-val='" + w_arr[i] +  "'>" + w_arr[i] + "</td>\n";

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
                    results += "<div>" + key + ": " + pList[key].exec().toString() + "</div>";
                });
                $("#Per_select_elem").val("inputs");
                $("#Per_select").trigger('change');

                $("#mini-result").html(results);
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
                    var w = C.Element.width;
                    C.Element.width = 10;
                    C.Element.width = w;
                    C.Context.lineWidth = 30;
                    C.Context.lineJoin = ctx.lineCap = 'round';
                },
                getData: getBinArray
            }
        }
    };
});