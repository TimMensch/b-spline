declare class BSpline {
    constructor(degree: number,points: Array<Array<number>>,
        knots?: Array<number>, weights?: Array<number>);
    getPoint(t: number, result?: Array<number>): Array<number>;
}