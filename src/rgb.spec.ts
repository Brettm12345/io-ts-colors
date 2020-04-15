import {either, right} from 'fp-ts/lib/Either'
import {HexToRGB, rgb, RGB} from './rgb'
import {Parsed} from './util'

const colors: Array<[string, Parsed<RGB>]> = [
  ['#ff0000', rgb(255, 0, 0)],
  ['#191a2a', rgb(25, 26, 42)],
  ['#ffffff', rgb(255, 255, 255)],
]

colors.forEach(([a, b]) => {
  test('Hex to RGB', () => {
    expect(HexToRGB.decode(a)).toEqual(b)
  })
  test('RGB to HEX', () => {
    expect(either.map(b, HexToRGB.encode)).toEqual(right(a))
  })
})
