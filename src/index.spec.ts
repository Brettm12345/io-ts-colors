import { right } from "fp-ts/lib/Either";
import { HexString, HSL, hsl, rgb, RGB, rgbToHsl } from "./index";

const colors: Array<[string, RGB, HSL]> = [
  ["#ff0000", rgb(255, 0, 0), hsl(0, 100, 50)],
  ["#00ffff", rgb(0, 255, 255), hsl(180, 100, 50)],
  ["#191a2a", rgb(25, 26, 42), hsl(236, 25.4, 13.1)],
  ["#fff", rgb(255, 255, 255), hsl(0, 0, 1)],
];

colors.forEach(([hexString, expectedRGB, expectedHSL]) => {
  test(`Parse rgb from ${hexString}`, () => {
    expect(HexString.decode(hexString)).toEqual(right(expectedRGB));
  });
  test(`Covert ${hexString} to hsl`, () => {
    expect(rgbToHsl(expectedRGB)).toEqual(expectedHSL);
  });
});
