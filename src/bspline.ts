export class BSpline {

    private _domain: number[];
    private _low: number;
    private _high: number;
    private _d: number;
    private _n: number;

    constructor(public degree: number, public points: Array<Array<number>>,
        public knots:Array<number>=[], public weights:Array<number>=[]) {

        let n = this._n = points.length;    // points count
        this._d = points[ 0 ].length; // point dimensionality

        if (degree < 1) throw new Error("degree must be at least 1 (linear)");
        if (degree > (n - 1)) throw new Error("degree must be less than or equal to point count - 1");

        if (this.weights.length===0) {
            // build weight vector of length [n]
            for (let i = 0; i < n; i++) {
                this.weights[ i ] = 1;
            }
        }

        if (this.knots.length===0) {
            // build knot vector of length [n + degree + 1]
            for (let i = 0; i < n + degree + 1; i++) {
                knots[ i ] = i;
            }
        } else {
            if (this.knots.length !== n + degree + 1) throw new Error("bad knot vector length");
        }
        this._domain = [
            degree,
            knots.length - 1 - degree
        ];

        this._low= knots[ this._domain[ 0 ] ];
        this._high = knots[ this._domain[ 1 ] ];
    }

    getPoint(t: number, result:Array<number>=[]): Array<number> {
        const d = this._d;

        // remap t to the domain where the spline is defined
        t = t * (this._high - this._low) + this._low;
        if (t < this._low || t > this._high) throw new Error("out of bounds");

        let splineSegment: number;
        // find splineSegment for the [t] value provided
        for (splineSegment = this._domain[ 0 ]; splineSegment < this._domain[ 1 ]; splineSegment++) {
            if (t >= this.knots[ splineSegment ] && t <= this.knots[ splineSegment + 1 ]) {
                break;
            }
        }
        // convert points to homogeneous coordinates
        let v:Array<Array<number>> = [];
        for (let i = 0; i < this._n; i++) {
            v[ i ] = [];
            for (let j = 0; j < d; j++) {
                v[ i ][ j ] = this.points[ i ][ j ] * this.weights[ i ];
            }
            v[ i ][ d ] = this.weights[ i ];
        }

        // l (level) goes from 1 to the curve degree + 1
        let alpha:number;
        for (let l = 1; l <= this.degree + 1; l++) {
            // build level l of the pyramid
            for (let i = splineSegment; i > splineSegment - this.degree - 1 + l; i--) {
                alpha = (t - this.knots[ i ]) / (this.knots[ i + this.degree + 1 - l ] - this.knots[ i ]);

                // interpolate each component
                for (let j = 0; j < d + 1; j++) {
                    v[ i ][ j ] = (1 - alpha) * v[ i - 1 ][ j ] + alpha * v[ i ][ j ];
                }
            }
        }

        // convert back to cartesian and return
        for (let i = 0; i < d; i++) {
            result[ i ] = v[ splineSegment ][ i ] / v[ splineSegment ][ d ];
        }

        return result;
    }
}
