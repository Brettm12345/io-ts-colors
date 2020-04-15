import { right } from "fp-ts/lib/Either";
import { HexString, HSLA, hsla, rgba, RGBA, rgbToHsl } from "./index";

const colors: Array<[string, RGBA, HSLA]> = [
  ["#191a2a", rgba(25, 26, 42), hsla(236, 25.4, 13.1)],
];

test("Parse Rgb", () => {
  colors.forEach(([hex, rgb]) => {
    expect(HexString.decode(hex)).toEqual(right(rgb));
  });
});

test("Convert HSL", () => {
  colors.forEach(([_, rgb, hsl]) => {
    expect(rgbToHsl(rgb)).toEqual(hsl);
  });
});
