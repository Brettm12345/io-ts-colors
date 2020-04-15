import { right } from "fp-ts/lib/Either";
import { HexString, HSLA, hsla, rgba, RGBA, rgbToHsl } from "./index";

const colors: Array<[string, RGBA, HSLA]> = [
  ["#ff0000", rgba(255, 0, 0), hsla(0, 100, 50)],
  ["#00ffff", rgba(0, 255, 255), hsla(180, 100, 50)],
  ["#191a2a", rgba(25, 26, 42), hsla(236, 25.4, 13.1)],
];

colors.forEach(([hex, rgb, hsl]) => {
  test(`Parse rgb from ${hex}`, () => {
    expect(HexString.decode(hex)).toEqual(right(rgb));
  });
  test(`Covert ${hex} to hsl`, () => {
    expect(rgbToHsl(rgb)).toEqual(hsl);
  });
});
