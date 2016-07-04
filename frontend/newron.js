define([], function(){
    var newron = function(type) {
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
                that.sigmaResult = (1 / ( 1 + Math.pow( Math.E, -x )));
                return	that.sigmaResult >= that.sigmaLimit;
            }
        };

        this.sum = 0;
        this.result = false;
        this.sigmaResult = 0;
        this.name = "";

        return this;
    };

    newron.prototype.setWeights = function(arr) {
        this.weights = arr;
        return this;
    };

    newron.prototype.setInputs = function(arr) {
        this.inputs = arr;
        return this;
    };


    newron.prototype.calcSum = function() {
        this.sum = 0;
        for (var i = 0; i < this.inputs.length; i++) {
            this.sum += this.inputs[i] * this.weights[i];
        }
        return this;
    };


    newron.prototype.estimate = function() {
        this.result = this.estimationFunctions[this.type](this.sum);
        return this.result;
    };

    newron.prototype.exec = function() {
        this.calcSum();
        return this.estimate();
    };



    newron.prototype.FN_Correction = function() {
        for (var i = 0; i < this.inputs.length; i++) {
            this.weights[i] += this.inputs[i];
        }
        return this;
    };

    newron.prototype.FP_Correction = function() {
        for (var i = 0; i < this.inputs.length; i++) {
            this.weights[i] -= this.inputs[i];
        }
        return this;
    };

    newron.prototype.correctWeights = function(estimatedResult) {
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

    return newron;
});