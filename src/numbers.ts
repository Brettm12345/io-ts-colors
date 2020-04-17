import * as C from 'io-ts/lib/Codec'
import * as D from 'io-ts/lib/Decoder'
import * as E from 'fp-ts/lib/Either'
import {not, constant, flow} from 'fp-ts/lib/function'

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
