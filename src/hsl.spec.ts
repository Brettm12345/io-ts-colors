import {Parsed} from './util'
import {RGB, rgb} from './rgb'
import {HSLFromRGB, hsl, HSL} from './hsl'
import {either} from 'fp-ts/lib/Either'

const colors: Array<[Parsed<RGB>, Parsed<HSL>]> = [
  [rgb(255, 0, 0), hsl(0, 100, 50)],
  [rgb(25, 26, 42), hsl(236, 25.4, 13.1)],
  [rgb(255, 255, 255), hsl(0, 0, 1)],
]
colors.forEach(([a, b], i) =>
  test(`HSL From RGB ${i}`, () => {
    expect(either.chain(a, HSLFromRGB.decode)).toEqual(b)
  })
)
