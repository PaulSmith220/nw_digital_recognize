requirejs.config({
    baseUrl: "/frontend/",
    paths: {
        jquery: '../bower_components/jquery/dist/jquery.min'
    }
});

var pList = {};
var Canvas = {};

require(["Perceptrone", "jquery", "js_add/events"], function(Perceptrone, $, Events) {
    window.$ = $;
    window.Perceptrone = Perceptrone;
    var library = [];

    for (var i = 0; i < 10; i++) {
        pList[i] = new Perceptrone("sigma");
        pList[i].sigmaLimit = 0.7;
        pList[i].sigmaNormalizator = 1;

    }

    $(function() {
        $.get("../images/data.json", function(data) {
            library = data;
            $(".train-library").html(Object.keys(library).map(function(item) {
                return library[item].map(function(img) {
                    return "<img src='../images/" + img + "' data-digit='" + item + "'/>";
                }).join("\n");
            }).join("\n"));
            $(".train-library img").on('click', function(){
                var $img = $(this).get(0);
                Canvas.Clear();
                ctx.drawImage($img, 0, 0, 150, 200);
                previewCtx.drawImage($img, 0, 0, 15, 20);
                $(".draw-block .recognize").click();
            });
        });

        $.get("../p_array.json", function(data) {
            Object.keys(data).forEach(function(key) {
               pList[key].weights = data[key].weights;
                $("#Per_select").append("<option data-number='" + key + "'>" + key + "</option>");
                Events.setPer_selectEvent();

            });
        } );

        Canvas = Events.setCanvasDrawMode();
        Canvas.Clear(Canvas);
    });
});

function wToJSON() {
    return "\n{\n" + Object.keys(pList).map(function(p){
            return '"' + p + '": {"weights":[' + pList[p].weights.join(", ") + "]}";
        }).join(",\n") + "\n}\n";

}