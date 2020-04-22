import * as D from 'io-ts/lib/Decoder'
import {range} from 'fp-ts/lib/Array'

export interface HexDigitBrand {
  readonly HexDigit: unique symbol
}
export type HexDigit = string & HexDigitBrand
export const HexDigit = D.refinement(
  D.string,
  (n): n is HexDigit =>
    range(1, 9)
      .map(x => x.toString())
      .concat('a', 'b', 'c', 'd', 'e', 'f')
      .includes(n),
  'HexDigit'
)
