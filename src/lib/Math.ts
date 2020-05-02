import {Endomorphism as Endo, flow, FunctionN as FN} from 'fp-ts/lib/function'
import {fold, monoidSum} from 'fp-ts/lib/Monoid'
import {pipe} from 'fp-ts/lib/pipeable'
import {CurriedEndo, Functions, Reduction} from './Fp'

export const oneWhenZero: Endo<number> = x => (x === 0 ? 1 : x)
export const {div, mult, add, sub, mod}: Functions<number> = {
  div: x => y => y / x,
  mult: x => y => y * x,
  add: x => y => y + x,
  sub: x => y => y - x,
  mod: x => y => y % x,
}
export const roundTo: CurriedEndo<number> = n =>
  pipe(oneWhenZero((n ?? 0) * 10), x => flow(mult(x), Math.round, div(x)))
export const sum: Reduction<number> = fold(monoidSum)
export const avg: FN<number[], number> = (...xs) =>
  pipe(xs, sum, div(xs.length))
export const decimalValue: Endo<number> = flow(Math.abs, x => x - Math.round(x))
