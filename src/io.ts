import * as C from 'io-ts/lib/Codec'
import * as D from 'io-ts/lib/Decoder'
import * as E from 'fp-ts/lib/Either'
import {not, constant, flow} from 'fp-ts/lib/function'
import {multiply, div, roundTo, mod} from './util'

interface NonEmptyStringBrand {
  readonly NonEmpty: unique symbol
}
export type NonEmptyString = string & NonEmptyStringBrand
export const NonEmptyString = D.refinement(
  D.string,
  (s): s is NonEmptyString => s.trim() !== '',
  'NonEmpty'
)

interface EightBitBrand {
  readonly EightBit: unique symbol
}
export type EightBit = number & EightBitBrand
export const EightBit = D.refinement(
  D.number,
  (n): n is EightBit => n >= 0 && n <= 255,
  'EightBit'
)

interface PercentageBrand {
  readonly Percentage: unique symbol
}
export type Percentage = number & PercentageBrand
export const Percentage = D.refinement(
  D.number,
  (n): n is Percentage => n >= 0 && n <= 100,
  'Percentage'
)

interface DegreeBrand {
  readonly Degree: unique symbol
}
export type Degree = number & DegreeBrand
export const Degree = D.refinement(
  D.number,
  (n): n is Degree => n >= 0 && n <= 360,
  'Degree'
)

export const IntFromString = C.make(
  D.parse(
    NonEmptyString,
    flow(
      parseInt,
      E.fromPredicate(not(isNaN), constant('Failed to parse int from string'))
    )
  ),
  {encode: String}
)

interface DecimalBrand {
  readonly Decimal: unique symbol
}
export type Decimal = number & DecimalBrand
export const Decimal = D.refinement(
  D.number,
  (n): n is Decimal => n >= 0 && n <= 1,
  'Decimal'
)

interface EightBitBrand {
  readonly EightBit: unique symbol
}

export const EightBitFromDecimal = C.make<EightBit>(
  D.parse(
    Decimal,
    flow(multiply(255), EightBit.decode, E.mapLeft(constant('err')))
  ),
  {encode: div(255)}
)

interface PercentageBrand {
  readonly Percentage: unique symbol
}
export const PercentFromNumber = C.make<Percentage>(
  D.parse(
    D.number,
    flow(
      multiply(100),
      roundTo(1),
      Percentage.decode,
      E.mapLeft(JSON.stringify)
    )
  ),
  {encode: div(100)}
)

interface DegreeBrand {
  readonly Degree: unique symbol
}
export const DegreeFromNumber = C.make<Degree>(
  D.parse(
    D.number,
    flow(
      multiply(60),
      mod(360),
      roundTo(0),
      Degree.decode,
      E.mapLeft(constant('Failed to parse degree'))
    )
  ),
  {encode: div(360)}
)
