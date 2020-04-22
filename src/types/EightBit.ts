import * as D from 'io-ts/lib/Decoder'
import {isPositive, Positive} from './Positive'

interface EightBitBrand {
  readonly EightBit: unique symbol
}
export type EightBit = number & EightBitBrand
export const EightBit = D.refinement(
  Positive,
  (n): n is EightBit & Positive => isPositive(n) && n <= 255,
  'EightBit'
)
