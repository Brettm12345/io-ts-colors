import * as t from 'io-ts'
import * as A from 'fp-ts/lib/Array'
import * as E from 'fp-ts/lib/Either'
import {pipe} from 'fp-ts/lib/pipeable'
import {NumberFromString} from 'io-ts-types/lib/NumberFromString'
import {either} from 'fp-ts/lib/Either'
import {array} from 'fp-ts/lib/Array'
import {flow} from 'fp-ts/lib/function'
import {monoidSum, monoidString} from 'fp-ts/lib/Monoid'
import {replaceAll, Decoder} from './util'
import {fold} from 'fp-ts/lib/Semigroup'
import {EightBit} from './units'

export const HexDigit = new t.Type<number, string>(
  'HexDigit',
  t.number.is,
  (u, c) =>
    either.chain(
      t.string.validate(u, c),
      flow(
        replaceAll(
          ['a', 'b', 'c', 'd', 'e', 'f'].map((a, i) => [a, (i + 10).toString()])
        ),
        NumberFromString.decode
      )
    ),
  x => (x === 0 ? '00' : x.toString(16))
)
export const RGB = t.type({r: EightBit, g: EightBit, b: EightBit})
export type RGB = t.TypeOf<typeof RGB>
export const HexToRGB = new t.Type<RGB, string>(
  'HexToRGB',
  RGB.is,
  (u, c) =>
    pipe(
      either.chain(t.string.validate(u, c), s =>
        pipe(
          s.replace(/^#/, '').split('').reverse(),
          s => (s.length === 3 ? s.concat(s) : s), // handle shorthand colors IE: #fff
          A.chunksOf(2),
          A.map(
            flow(
              A.mapWithIndex((i, a) =>
                pipe(
                  HexDigit.decode(a),
                  E.map(x => (i > 0 ? x * (i * 16) : x))
                )
              ),
              array.sequence(either),
              E.chain(x => EightBit.decode(fold(monoidSum)(0, x)))
            )
          ),

          array.sequence(either),
          E.map(flow(A.reverse, ([r, g, b]) => ({r, g, b})))
        )
      )
    ),
  ({r, g, b}) => '#' + pipe([r, g, b], A.foldMap(monoidString)(HexDigit.encode))
)

export const rgb: Decoder<RGB> = (r, g, b) => RGB.decode({r, g, b})
