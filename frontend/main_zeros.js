requirejs.config({
    baseUrl: "/frontend/",
    paths: {
        jquery: '../bower_components/jquery/dist/jquery.min'
    }
});

var pList = {};
var Canvas = {};

require(["newron", "jquery", "js_add/events"], function(newron, $, Events) {
    window.$ = $;
    window.newron = newron;
    var library = [];

    for (var i = 0; i < 10; i++) {
        pList[i] = new newron("sigma");
        pList[i].sigmaLimit = 0.501;
        pList[i].sigmaNormalizator = 200;
        pList[i].weights = [];
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

                $(".train-library img").removeClass('active');
                $(this).addClass('active');
            });
        });

        $.get("../p_array.json", function(data) {
            Object.keys(data).forEach(function(key) {
                for (var n = 0; n < 300; n++) {
                    pList[key].weights[n] = 0;
                }
                $("#Per_select").append("<option data-number='" + key + "'>" + key + "</option>");
                Events.setPer_selectEvent();

            });
        } );


        Canvas = Events.setCanvasDrawMode();
        Canvas.Clear(Canvas);

        var wToJSON = function() {
            return "\n{\n" + Object.keys(pList).map(function(p){
                    return '"' + p + '": {"weights":[' + pList[p].weights.join(", ") + "]}";
                }).join(",\n") + "\n}\n";

        };
        $("#getWeights").on('click', function(){
            console.log(wToJSON());
        });
    });
});


window.iterator = 1;
function iterateImages() {
    $(".train-library img:nth-child(" + (window.iterator++) +")").click()
}

function resetIterator() {
    window.iterator = 1;
}