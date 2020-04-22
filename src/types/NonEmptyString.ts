import * as D from 'io-ts/lib/Decoder'

interface NonEmptyStringBrand {
  readonly NonEmpty: unique symbol
}
export type NonEmptyString = string & NonEmptyStringBrand
export const NonEmptyString = D.refinement(
  D.string,
  (s): s is NonEmptyString => s.trim() !== '',
  'NonEmpty'
)
