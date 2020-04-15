import {Do} from 'fp-ts-contrib/lib/Do'
import * as A from 'fp-ts/lib/Array'
import * as E from 'fp-ts/lib/Either'
import {either, Either} from 'fp-ts/lib/Either'
import {
  Endomorphism as Endo,
  flow,
  FunctionN as FN,
  unsafeCoerce,
} from 'fp-ts/lib/function'
import {monoidSum} from 'fp-ts/lib/Monoid'
import {pipe} from 'fp-ts/lib/pipeable'
import * as t from 'io-ts'
import {avg, deltaMax, multiply, replaceAll, roundTo} from './util'

const {round} = Math

interface PercentageBrand {
  readonly Percentage: unique symbol
}
const Percentage = t.brand(
  t.number,
  (n): n is t.Branded<number, PercentageBrand> => n >= 0 && n <= 100,
  'Percentage'
)
type Percentage = t.TypeOf<typeof Percentage>

interface DegreeBrand {
  readonly Degree: unique symbol
}
const Degree = t.brand(
  t.number,
  (n): n is t.Branded<number, DegreeBrand> => n >= 0 && n <= 360,
  'Degree'
)
type Degree = t.TypeOf<typeof Degree>

interface EightBitBrand {
  readonly EightBit: unique symbol
}
const EightBit = t.brand(
  t.number,
  (n): n is t.Branded<number, EightBitBrand> => n >= 0 && n <= 255,
  'EightBit'
)
type EightBit = t.TypeOf<typeof EightBit>
const RGB = t.type({r: EightBit, g: EightBit, b: EightBit})
const HSL = t.type({h: Degree, s: Percentage, l: Percentage})
export type RGB = t.TypeOf<typeof RGB>
export type HSL = t.TypeOf<typeof HSL>
export type Parsed<T> = Either<t.Errors, T>
export type Decoder<T> = FN<unknown[], Parsed<T>>
export const rgb: Decoder<RGB> = (r, g, b) => RGB.decode({r, g, b})
export const hsl: Decoder<HSL> = (h, s, l) => HSL.decode({h, s, l})

const hexDigit: Endo<string> = replaceAll(
  ['a', 'b', 'c', 'd', 'e', 'f'].map((a, i) => [a, (i + 10).toString()])
)

export const HexToRGB = new t.Type<RGB, string, unknown>(
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
              A.foldMapWithIndex(monoidSum)((i, a) =>
                pipe(hexDigit(a), x => (i > 0 ? +x * (i * 16) : +x))
              ),
              EightBit.decode
            )
          ),
          A.reverse,
          A.array.sequence(either),
          E.map(([r, g, b]): RGB => ({r, g, b}))
        )
      )
    ),
  String
)
const percent = flow(multiply(100), roundTo(1), Percentage.decode)
export const RGBToHSL = new t.Type<HSL, RGB, unknown>(
  'RGBToHSL',
  HSL.is,
  (u, c) =>
    pipe(
      either.chain(RGB.validate(u, c), ({r, g, b}) => {
        const tuple = [r, g, b]
        const [max, min] = ['max', 'min'].map(k => Math[k](...tuple) / 255)
        const delta = max - min
        if (delta === 0) return hsl(0, 0, max) // The color is grayscale
        const sum = max + min
        const maxIndex = tuple.indexOf((max * 255) as EightBit)
        const d = deltaMax(tuple)
        return Do(either)
          .bindL('h', () =>
            Degree.decode(
              round((60 * (2 * maxIndex + (d(1) - d(2)) / (delta * 255))) % 360)
            )
          )
          .bindL('l', () => percent(avg(max, min)))
          .bindL('s', ({l}) => percent(delta / (l > 50 ? 2 - delta : sum)))
          .done()
      })
    ),
  unsafeCoerce // TODO: Convert RGB TO HSL
)
