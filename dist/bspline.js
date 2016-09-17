"use strict";
var BSpline = (function () {
    function BSpline(degree, points, knots, weights) {
        if (knots === void 0) { knots = []; }
        if (weights === void 0) { weights = []; }
        this.degree = degree;
        this.points = points;
        this.knots = knots;
        this.weights = weights;
        var n = this._n = points.length;
        this._d = points[0].length;
        if (degree < 1)
            throw new Error("degree must be at least 1 (linear)");
        if (degree > (n - 1))
            throw new Error("degree must be less than or equal to point count - 1");
        if (this.weights.length === 0) {
            for (var i = 0; i < n; i++) {
                this.weights[i] = 1;
            }
        }
        if (this.knots.length === 0) {
            for (var i = 0; i < n + degree + 1; i++) {
                knots[i] = i;
            }
        }
        else {
            if (this.knots.length !== n + degree + 1)
                throw new Error("bad knot vector length");
        }
        this._domain = [
            degree,
            knots.length - 1 - degree
        ];
        this._low = knots[this._domain[0]];
        this._high = knots[this._domain[1]];
    }
    BSpline.prototype.getPoint = function (t, result) {
        if (result === void 0) { result = []; }
        var d = this._d;
        t = t * (this._high - this._low) + this._low;
        if (t < this._low || t > this._high)
            throw new Error("out of bounds");
        var splineSegment;
        for (splineSegment = this._domain[0]; splineSegment < this._domain[1]; splineSegment++) {
            if (t >= this.knots[splineSegment] && t <= this.knots[splineSegment + 1]) {
                break;
            }
        }
        var v = [];
        for (var i = 0; i < this._n; i++) {
            v[i] = [];
            for (var j = 0; j < d; j++) {
                v[i][j] = this.points[i][j] * this.weights[i];
            }
            v[i][d] = this.weights[i];
        }
        var alpha;
        for (var l = 1; l <= this.degree + 1; l++) {
            for (var i = splineSegment; i > splineSegment - this.degree - 1 + l; i--) {
                alpha = (t - this.knots[i]) / (this.knots[i + this.degree + 1 - l] - this.knots[i]);
                for (var j = 0; j < d + 1; j++) {
                    v[i][j] = (1 - alpha) * v[i - 1][j] + alpha * v[i][j];
                }
            }
        }
        for (var i = 0; i < d; i++) {
            result[i] = v[splineSegment][i] / v[splineSegment][d];
        }
        return result;
    };
    return BSpline;
}());
exports.BSpline = BSpline;

//# sourceMappingURL=bspline.js.map
