import {Do} from 'fp-ts-contrib/lib/Do'
import {either, Either} from 'fp-ts/lib/Either'
import {flow, FunctionN as FN, unsafeCoerce} from 'fp-ts/lib/function'
import {pipe} from 'fp-ts/lib/pipeable'
import * as t from 'io-ts'
import {avg, deltaMax, multiply, roundTo} from './util'
import {RGB, EightBit} from './rgb'

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

const HSL = t.type({h: Degree, s: Percentage, l: Percentage})
export type HSL = t.TypeOf<typeof HSL>
export type Parsed<T> = Either<t.Errors, T>
export type Decoder<T> = FN<unknown[], Parsed<T>>
export const hsl: Decoder<HSL> = (h, s, l) => HSL.decode({h, s, l})
const percent = flow(multiply(100), roundTo(1), Percentage.decode)
export const HSLFromRGB = new t.Type<HSL, RGB, unknown>(
  'HSLFromRGB',
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
