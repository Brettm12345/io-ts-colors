import {either, right} from 'fp-ts/lib/Either'
import {HexToRGB, HSL, hsl, rgb, Parsed, RGB, RGBToHSL} from './index'

const colors: Array<[string, Parsed<RGB>, Parsed<HSL>]> = [
  ['#ff0000', rgb(255, 0, 0), hsl(0, 100, 50)],
  ['#191a2a', rgb(25, 26, 42), hsl(236, 25.4, 13.1)],
  ['#ffffff', rgb(255, 255, 255), hsl(0, 0, 1)],
]

colors.forEach(([hex, rgb, hsl]) => {
  test('Hex to RGB', () => {
    expect(HexToRGB.decode(hex)).toEqual(rgb)
  })
  test('RGB to HEX', () => {
    expect(either.map(rgb, HexToRGB.encode)).toEqual(right(hex))
  })
  test('RGB to HSL', () => {
    expect(either.chain(rgb, RGBToHSL.decode)).toEqual(hsl)
  })
})
