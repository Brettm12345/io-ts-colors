import { Endomorphism, flow, constant } from "fp-ts/lib/function";
import { semigroupSum } from "fp-ts/lib/Semigroup";
import * as A from "fp-ts/lib/Array";
import * as O from "fp-ts/lib/Option";
import { pipe } from "fp-ts/lib/pipeable";
import { eqNumber } from "fp-ts/lib/Eq";

type NumberFunc = (x: number) => Endomorphism<number>;
export const debug = (msg: string = "") => <A>(a: A): A => {
  console.log(msg, a);
  return a;
};
export const maybe = <A>(a: A) =>
  flow(O.fromNullable, O.getOrElse(constant(a)));
export const eqNum = (x: number) => (y: number): boolean =>
  eqNumber.equals(x, y);
export const div: NumberFunc = (x) => (y) => y / x;
export const multiply: NumberFunc = (x) => (y) => y * x;
export const add: NumberFunc = (x) => (y) => y + x;
export const sub: NumberFunc = (x) => (y) => y - x;
export const mod: NumberFunc = (x) => (y) => y % x;
export const sum = A.reduce(0, semigroupSum.concat);
export const oneIfZero: Endomorphism<number> = (x) => (x === 0 ? 1 : x);
export const avg = (...xs: number[]) => pipe(xs, sum, div(xs.length));
export const round: NumberFunc = flow(maybe(0), multiply(10), oneIfZero, (x) =>
  flow(multiply(x), Math.round, div(x))
);
export const deg: Endomorphism<number> = flow(multiply(60), mod(360), round(0));
export const percentage: Endomorphism<number> = flow(multiply(100), round(1));
export const indexOf = <A>(xs: A[]) => (x: A) => xs.indexOf(x);
