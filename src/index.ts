import * as A from 'fp-ts/lib/Array'
import * as E from 'fp-ts/lib/Either'
import {either} from 'fp-ts/lib/Either'
import {monoidAll, monoidSum} from 'fp-ts/lib/Monoid'
import {pipe} from 'fp-ts/lib/pipeable'
import * as t from 'io-ts'
import {flow, Endomorphism as Endo, FunctionN as FN} from 'fp-ts/lib/function'
import {percent, avg, isBetween, replaceAll, deltaMax} from './util'

const {values, keys} = Object
const {round} = Math

export type RGB = Record<'r' | 'g' | 'b', number>
export type HSL = Record<'h' | 's' | 'l', number>

type MKColor<T> = FN<[number, number, number], T>

export const rgb: MKColor<RGB> = (r, g, b) => ({r, g, b})
export const hsl: MKColor<HSL> = (h, s, l) => ({h, s, l})

const hexDigit: Endo<string> = replaceAll(
  ['a', 'b', 'c', 'd', 'e', 'f'].map((a, i) => [a, (i + 10).toString()])
)

export const HexString = new t.Type<RGB, string, unknown>(
  'HexString',
  (x): x is RGB =>
    A.foldMap(monoidAll)(isBetween(0, 255))(values(x)) &&
    keys(x) === ['r', 'g', 'b'],
  (u, c) =>
    pipe(
      either.chain(t.string.validate(u, c), s =>
        pipe(
          s.replace(/^#/, '').split('').reverse(),
          s => (s.length === 3 ? s.concat(s) : s), // handle shorthand colors IE: #fff
          A.chunksOf(2),
          A.map(
            flow(
              A.foldMapWithIndex(monoidSum)((i, a) =>
                pipe(hexDigit(a), x => (i > 0 ? +x * (i * 16) : +x))
              ),
              t.number.decode
            )
          ),
          A.reverse,
          A.array.sequence(either),
          E.map(([r, g, b]) => ({r, g, b}))
        )
      )
    ),
  String
)

export const rgbToHsl = ({r, g, b}: RGB): HSL => {
  const tuple = [r, g, b]
  const [max, min] = ['max', 'min'].map(k => Math[k](...tuple) / 255)
  const delta = max - min
  if (delta === 0) return {h: 0, s: 0, l: max} // The color is grayscale
  const sum = max + min
  const l = percent(avg(max, min))
  const maxIndex = tuple.indexOf(max * 255)
  const d = deltaMax(tuple)
  return {
    h: round((60 * (2 * maxIndex + (d(1) - d(2)) / (delta * 255))) % 360),
    s: percent(delta / (l > 50 ? 2 - delta : sum)),
    l,
  }
}
