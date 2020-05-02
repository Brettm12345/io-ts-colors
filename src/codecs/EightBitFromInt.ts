import {flow} from 'fp-ts/lib/function'
import * as C from 'io-ts/lib/Codec'
import * as D from 'io-ts/lib/Decoder'
import {decodeWithError, div, mult} from '../lib'
import {Decimal, EightBit} from '../types'

export const EightBitFromInt = C.make<EightBit>(
  D.parse(Decimal, flow(mult(255), decodeWithError(EightBit))),
  {encode: div(255)}
)
