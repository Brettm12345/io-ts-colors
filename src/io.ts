import * as C from 'io-ts/lib/Codec'
import * as D from 'io-ts/lib/Decoder'
import * as E from 'fp-ts/lib/Either'
import {not, constant, flow} from 'fp-ts/lib/function'
import {multiply, div, roundTo, mod} from './util'

export const showError = E.mapLeft(JSON.stringify)

interface NonEmptyStringBrand {
  readonly NonEmpty: unique symbol
}
export type NonEmptyString = string & NonEmptyStringBrand
export const NonEmptyString = D.refinement(
  D.string,
  (s): s is NonEmptyString => s.trim() !== '',
  'NonEmpty'
)

interface PositiveBrand {
  readonly Positive: unique symbol
}
export type Positive = number & PositiveBrand
export const Positive = D.refinement(
  D.number,
  (n): n is Positive => n >= 0,
  'Positive'
)
export const isPositive = flow(Positive.decode, E.isRight)

interface DecimalBrand {
  readonly Decimal: unique symbol
}
export type Decimal = number & DecimalBrand & PositiveBrand
export const Decimal = D.refinement(
  D.number,
  (n): n is Decimal => isPositive && n <= 1,
  'Decimal'
)

interface EightBitBrand {
  readonly EightBit: unique symbol
}
export type EightBit = number & EightBitBrand
export const EightBit = D.refinement(
  Positive,
  (n): n is EightBit & Positive => isPositive(n) && n <= 255,
  'EightBit'
)
export const EightBitFromDecimal = C.make<EightBit>(
  D.parse(Decimal, flow(multiply(255), EightBit.decode, showError)),
  {encode: div(255)}
)
interface PercentageBrand {
  readonly Percentage: unique symbol
}
export type Percentage = number & PercentageBrand & Positive
export const Percentage = D.refinement(
  Positive,
  (n): n is Percentage => n <= 100,
  'Percentage'
)
export const PercentFromNumber = C.make<Percentage>(
  D.parse(
    Positive,
    flow(multiply(100), roundTo(1), Percentage.decode, showError)
  ),
  {encode: div(100)}
)

export const IntFromString = C.make(
  D.parse(
    NonEmptyString,
    flow(parseInt, E.fromPredicate(not(isNaN), constant('Error: Not a number')))
  ),
  {encode: String}
)

interface DegreeBrand {
  readonly Degree: unique symbol
}
export type Degree = number & DegreeBrand & PositiveBrand
export const Degree = D.refinement(
  Positive,
  (n): n is Degree => isPositive(n) && n <= 360,
  'Degree'
)
export const DegreeFromNumber = C.make<Degree>(
  D.parse(
    Positive,
    flow(multiply(60), mod(360), roundTo(0), Degree.decode, showError)
  ),
  {encode: div(360)}
)
