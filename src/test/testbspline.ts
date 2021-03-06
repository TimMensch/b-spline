///

import { BSpline } from "../bspline";

const tvalues = [ 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0 ];
const degree = 2;

/**
 * epsilon-based numerical equivalence for two points
 */
function equivalent(found:Array<number>, target:Array<number>, e:number = 0.001) {
  return !found.some(function (v, idx) {
    return Math.abs(v - target[ idx ]) > e;
  });
}

/**
 * verify that a particular full curve description matches the result of interpolate()
 */
function verify(description:string, tvalues:Array<number>, points:Array<Array<number>>, expected:Array<Array<number>>, degree:number=2, knots?:Array<number>, weights?:Array<number>) {
  let errors:string[] = [];
  tvalues.map(function (t) {
    let bspline = new BSpline(degree, points, knots, weights);
    return bspline.getPoint(t);
  }).forEach(function (v, idx) {
    let t = expected[ idx ];
    if (!equivalent(v, t)) {
      errors.push([
        "Sample",
        idx,
        "did not yield the expected result.",
        v,
        "not equal to",
        t
      ].join(" "));
    }
  });
  console.log(description + ": " + (errors.length > 0 ? "failed" : "passed"));
  if (errors.length > 0) {
    console.error(errors);
    process.exit(1);
  }
}

// test uniform curve
let points = [
  [ -1.0, 0.0 ],
  [ -0.5, 0.5 ],
  [ 0.5, -0.5 ],
  [ 1.0, 0.0 ]
];
let expected = [
  [ -0.75, 0.25 ],
  [ -0.64, 0.32 ],
  [ -0.51, 0.33 ],
  [ -0.36, 0.28 ],
  [ -0.19, 0.17 ],
  [ 0, 0 ],
  [ 0.19, -0.17 ],
  [ 0.36, -0.28 ],
  [ 0.51, -0.33 ],
  [ 0.64, -0.32 ],
  [ 0.75, -0.25 ]
];
verify("uniform b-spline test", tvalues, points, expected);


// test non-uniform curve
let knots = [ 0, 0, 0, 1, 2, 2, 2 ];
expected = [
  [ -1, 0 ],
  [ -0.8, 0.16 ],
  [ -0.6, 0.24 ],
  [ -0.4, 0.24 ],
  [ -0.2, 0.16 ],
  [ 0, 0 ],
  [ 0.2, -0.16 ],
  [ 0.4, -0.24 ],
  [ 0.6, -0.24 ],
  [ 0.8, -0.16 ],
  [ 1, 0 ]
];
verify("non-uniform b-spline test", tvalues, points, expected, degree, knots);


// test closed non-uniform curvce
points = [
  [ -1.0, 0.0 ],
  [ -0.5, 0.5 ],
  [ 0.5, -0.5 ],
  [ 1.0, 0.0 ],
  // ...
  [ -1.0, 0.0 ],
  [ -0.5, 0.5 ],
  [ 0.5, -0.5 ]
];
knots = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ];
expected = [
  [ -0.75, 0.25 ],
  [ -0.4375, 0.3125 ],
  [ 0, 0 ],
  [ 0.4375, -0.3125 ],
  [ 0.75, -0.25 ],
  [ 0.6875, -0.0625 ],
  [ 0, 0 ],
  [ -0.6875, 0.0625 ],
  [ -0.75, 0.25 ],
  [ -0.4375, 0.3125 ],
  [ 0, 0 ]
];
verify("closed non-uniform b-spline test", tvalues, points, expected, degree, knots);


// test non-uniform rational curve
points = [
  [ 0.0, -0.5 ],
  [ -0.5, -0.5 ],
  [ -0.5, 0.0 ],
  [ -0.5, 0.5 ],
  [ 0.0, 0.5 ],
  [ 0.5, 0.5 ],
  [ 0.5, 0.0 ],
  [ 0.5, -0.5 ],
  // duplicated first point
  [ 0.0, -0.5 ]
];
knots = [ 0, 0, 0, 1 / 4, 1 / 4, 1 / 2, 1 / 2, 3 / 4, 3 / 4, 1, 1, 1 ];
let w = Math.pow(0.5, 0.5);
let weights = [ 1, w, 1, w, 1, w, 1, w, 1 ];
expected = [
  [ 0, -0.5 ],
  [ -0.29, -0.4069 ],
  [ -0.4779, -0.1469 ],
  [ -0.4779, 0.1469 ],
  [ -0.29, 0.4069 ],
  [ 0, 0.5 ],
  [ 0.29, 0.4069 ],
  [ 0.4779, 0.1469 ],
  [ 0.4779, -0.1469 ],
  [ 0.29, -0.4069 ],
  [ 0, -0.5 ]
];
verify("non-uniform rational b-spline test", tvalues, points, expected, degree, knots, weights);

// test non-uniform rational curve with boosted weights
let boosted = 4 * w;
weights = [ 1, boosted, 1, boosted, 1, boosted, 1, boosted, 1 ];
expected = [
  [ 0, -0.5 ],
  [ -0.4041, -0.4574 ],
  [ -0.4874, -0.2981 ],
  [ -0.4874, 0.2981 ],
  [ -0.4041, 0.4574 ],
  [ 0, 0.5 ],
  [ 0.4041, 0.4574 ],
  [ 0.4874, 0.2981 ],
  [ 0.4874, -0.2981 ],
  [ 0.4041, -0.4574 ],
  [ 0, -0.5 ]
];

verify("weight-boosted non-uniform rational b-spline test", tvalues, points, expected, degree, knots, weights);
