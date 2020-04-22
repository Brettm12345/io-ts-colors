import * as D from 'io-ts/lib/Decoder'
import * as C from 'io-ts/lib/Codec'
import {Positive, Degree} from '../types'
import {multiply, div, mod, roundTo, showError} from '../util'
import {flow} from 'fp-ts/lib/function'

export const DegreeFromInt = C.make<Degree>(
  D.parse(
    Positive,
    flow(multiply(60), mod(360), roundTo(0), Degree.decode, showError)
  ),
  {encode: div(360)}
)
