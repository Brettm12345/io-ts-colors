import * as E from 'fp-ts/lib/Either'
import {right} from 'fp-ts/lib/Either'
import {pipe} from 'fp-ts/lib/pipeable'
import {HexToRGB, HSL, hsl, rgb, Parsed, RGB, RGBToHSL} from './index'

const colors: Array<[string, Parsed<RGB>, Parsed<HSL>]> = [
  ['#ff0000', rgb(255, 0, 0), hsl(0, 100, 50)],
  ['#00ffff', rgb(0, 255, 255), hsl(180, 100, 50)],
  ['#191a2a', rgb(25, 26, 42), hsl(236, 25.4, 13.1)],
  ['#fff', rgb(255, 255, 255), hsl(0, 0, 1)],
]

colors.forEach(([hexString, expectedRGB, expectedHSL]) => {
  test(`Parse rgb from ${hexString}`, () => {
    expect(HexToRGB.decode(hexString)).toEqual(expectedRGB)
  })
  test(`Covert ${hexString} to hsl`, () => {
    expect(pipe(expectedRGB, E.chain(RGBToHSL.decode))).toEqual(expectedHSL)
  })
})
