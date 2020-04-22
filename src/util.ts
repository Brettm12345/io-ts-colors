import * as A from 'fp-ts/lib/Array'
import * as E from 'fp-ts/lib/Either'
import {
  constant,
  Endomorphism as Endo,
  flow,
  FunctionN as FN,
} from 'fp-ts/lib/function'
import {fold, monoidSum} from 'fp-ts/lib/Monoid'
import * as O from 'fp-ts/lib/Option'
import {pipe} from 'fp-ts/lib/pipeable'
import {Decoder} from 'io-ts/lib/Decoder'

export type Decoded<T> = ReturnType<Decoder<T>['decode']>
export type Builder<T> = FN<number[], Decoded<T>>
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
export const avg = (...xs: number[]) => pipe(xs, sum, div(xs.length))
export const oneWhenZero: Endo<number> = x => (x === 0 ? 1 : x)
export const indexed = <A>(xs: A[]) => xs.map((x, i) => [i, x])
export const base16 = (x: number): string => x.toString(16)
export const sum = fold(monoidSum)

export const isBetween = (min: number, max: number) => (x: number) =>
  min >= x && x <= max

export const roundTo: NumFn = flow(maybe(0), multiply(10), oneWhenZero, x =>
  flow(multiply(x), Math.round, div(x))
)

export const between0and1: Endo<number> = flow(Math.abs, x => x - roundTo(0)(x))
export const percent: Endo<number> = flow(multiply(100), roundTo(1))
export const indexFrom = <A>(xs: A[]) => (x: A) => xs.indexOf(x)

/**
 * Return the element `n` slots away from the maximum value in the array.
 * Cycling back to the first value after reaching the end.
 */
export const deltaMax = (xs: number[]) => (n: number): number =>
  xs[(xs.indexOf(Math.max(...xs)) + n) % xs.length]

export const replaceAll = (xs: Replacement[]): Endo<string> => x =>
  pipe(
    xs,
    A.reduce(x, (b, a) => b.replace(...a))
  )

export const showError = E.mapLeft(JSON.stringify)
