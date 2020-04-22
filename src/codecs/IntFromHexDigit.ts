import {constant, flow} from 'fp-ts/lib/function'
import * as C from 'io-ts/lib/Codec'
import * as D from 'io-ts/lib/Decoder'
import {Literal, match, Number} from 'runtypes'
import {NonEmptyString} from '../types'
import {base16, replaceAll, showError} from '../util'
import {IntFromString} from './IntFromString'

const HexZero = constant('00')

export const IntFromHexDigit = C.make<number>(
  D.parse(
    NonEmptyString,
    flow(
      replaceAll(
        ['a', 'b', 'c', 'd', 'e', 'f'].map((a, i) => [a, (i + 10).toString()])
      ),
      IntFromString.decode,
      showError
    )
  ),
  {encode: match([Literal(0), HexZero], [Number, base16])}
)
