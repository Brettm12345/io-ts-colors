import {flow} from 'fp-ts/lib/function'
import * as C from 'io-ts/lib/Codec'
import * as D from 'io-ts/lib/Decoder'
import {decodeWithError, div, mod, mult, roundTo} from '../lib'
import {Degree, Positive} from '../types'

export const DegreeFromInt = C.make<Degree>(
  D.parse(
    Positive,
    flow(mult(60), mod(360), roundTo(0), decodeWithError(Degree))
  ),
  {encode: div(360)}
)
