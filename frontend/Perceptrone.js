define([], function(){
    var Perceptrone = function(type) {
        this.type = type == 'sigma' ? type : 'linear';
        this.sigmaLimit = 0.6;
        this.sigmaNormalizator = 1;
        var that = this;
        this.estimationFunctions = {
            linear: function(x) {
                return x > 0.5;
            },
            sigma: function(x) {
                x = x/that.sigmaNormalizator;
                return	(1 / ( 1 + Math.pow( Math.E, -x ))) >= that.sigmaLimit;
            }
        };

        this.sum = 0;
        this.result = false;
        this.name = "";

        return this;
    };

    Perceptrone.prototype.setWeights = function(arr) {
        this.weights = arr;
        return this;
    };

    Perceptrone.prototype.setInputs = function(arr) {
        this.inputs = arr;
        return this;
    };


    Perceptrone.prototype.calcSum = function() {
        this.sum = 0;
        for (var i = 0; i < this.inputs.length; i++) {
            this.sum += this.inputs[i] * this.weights[i];
        }
        return this;
    };


    Perceptrone.prototype.estimate = function() {
        this.result = this.estimationFunctions[this.type](this.sum);
        return this.result;
    };

    Perceptrone.prototype.exec = function() {
        this.calcSum();
        return this.estimate();
    };



    Perceptrone.prototype.FN_Correction = function() {
        console.log(this.name + ": FN");
        for (var i = 0; i < this.inputs.length; i++) {
            this.weights[i] += this.inputs[i];
        }
        return this;
    };

    Perceptrone.prototype.FP_Correction = function() {
        console.log(this.name + ": FP");
        for (var i = 0; i < this.inputs.length; i++) {
            this.weights[i] -= this.inputs[i];
        }
        return this;
    };

    Perceptrone.prototype.correctWeights = function(estimatedResult) {
        if (estimatedResult == undefined) {
            throw Error("You should set estimatedResult to correctWeights");
        }
        if (this.result != estimatedResult && this.result == false) {
            this.FN_Correction();
        }
        if (this.result != estimatedResult && this.result == true) {
            this.FP_Correction();
        }
        return this;
    };

    return Perceptrone;
});