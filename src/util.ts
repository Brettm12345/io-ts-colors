import {Endomorphism as Endo, flow, constant} from 'fp-ts/lib/function'
import * as A from 'fp-ts/lib/Array'
import * as O from 'fp-ts/lib/Option'
import {pipe} from 'fp-ts/lib/pipeable'
import {semigroupSum} from 'fp-ts/lib/Semigroup'

type Search = string | RegExp
type Replacement = [Search, string]
type NumFn = (x: number) => Endo<number>

export const debug = (msg: string = '') => <A>(a: A): A => {
  console.log(msg, a)
  return a
}
export const maybe = <A>(a: A) => flow(O.fromNullable, O.getOrElse(constant(a)))
export const div: NumFn = x => y => y / x
export const multiply: NumFn = x => y => y * x
export const add: NumFn = x => y => y + x
export const sub: NumFn = x => y => y - x
export const mod: NumFn = x => y => y % x
export const sum = A.reduce(0, semigroupSum.concat)
export const avg = (...xs: number[]) => pipe(xs, sum, div(xs.length))
export const oneWhenZero: Endo<number> = x => (x === 0 ? 1 : x)

export const isBetween = (min: number, max: number) => (x: number) =>
  min >= x && x <= max

export const roundTo: NumFn = flow(maybe(0), multiply(10), oneWhenZero, x =>
  flow(multiply(x), Math.round, div(x))
)

export const percent: Endo<number> = flow(multiply(100), roundTo(1))

/**
 * Returns the value n places away from the maximum value in the array.
 * Cycles the array. IE: It returns to the first value after reaching the end
 */
export const deltaMax = (xs: number[]) => (n: number): number =>
  xs[(xs.indexOf(Math.max(...xs)) + n) % xs.length]

export const replaceAll = (xs: Replacement[]): Endo<string> => x =>
  pipe(
    xs,
    A.reduce(x, (b, a) => b.replace(...a))
  )
