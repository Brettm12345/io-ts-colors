import * as A from 'fp-ts/lib/Array'
import {array} from 'fp-ts/lib/Array'
import * as E from 'fp-ts/lib/Either'
import {either} from 'fp-ts/lib/Either'
import {flow} from 'fp-ts/lib/function'
import {pipe} from 'fp-ts/lib/pipeable'
import * as C from 'io-ts/lib/Codec'
import * as D from 'io-ts/lib/Decoder'
import {sum} from '../lib'
import {EightBit, RGB} from '../types'
import {IntFromHexDigit} from './IntFromHexDigit'

export const RGBFromHex = C.make<RGB>(
  D.parse(D.string, s =>
    pipe(
      s.replace(/^#/, '').split('').reverse(),
      s => (s.length === 3 ? s.concat(s) : s), // handle shorthand colors IE: #fff
      A.chunksOf(2),
      A.map(
        flow(
          A.mapWithIndex((i, a) =>
            pipe(
              a,
              IntFromHexDigit.decode,
              E.map(x => (i > 0 ? x * (i * 16) : x))
            )
          ),
          array.sequence(either),
          E.map(sum),
          E.chain(EightBit.decode)
        )
      ),
      array.sequence(either),
      E.bimap(JSON.stringify, ([b, g, r]) => [r, g, b])
    )
  ),
  {
    encode: rgb => '#' + rgb.map(IntFromHexDigit.encode).join(''),
  }
)
