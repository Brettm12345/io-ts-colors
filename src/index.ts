import * as A from "fp-ts/lib/Array";
import * as E from "fp-ts/lib/Either";
import { either } from "fp-ts/lib/Either";
import { monoidAll, monoidSum } from "fp-ts/lib/Monoid";
import { pipe } from "fp-ts/lib/pipeable";
import * as t from "io-ts";
import { replaceAll, intToString } from "./strings";
import { flow } from "fp-ts/lib/function";
import { div, multiply, add, mod, avg, indexOf, percentage, deg } from "./util";

export type RGBA = Record<"r" | "g" | "b" | "a", number>;
export type HSLA = Record<"h" | "s" | "l" | "a", number>;

export const rgba = (r: number, g: number, b: number, a: number = 1): RGBA => ({
  r,
  g,
  b,
  a,
});

export const hsla = (h: number, s: number, l: number, a: number = 1): HSLA => ({
  h,
  s,
  l,
  a,
});
const handleHex = pipe(
  A.zip(
    ["a", "b", "c", "d", "e", "f"],
    pipe(A.range(10, 15), A.map(intToString))
  ),
  replaceAll
);

export const HexString = new t.Type<RGBA, string, unknown>(
  "HexString",
  (x): x is RGBA => {
    const baseKeys = ["r", "g", "b"];
    const keys = Object.keys(x);
    return (
      keys === baseKeys ||
      (keys === [...baseKeys, "a"] &&
        A.foldMap(monoidAll)(t.number.is)(Object.values(x)))
    );
  },
  (u, c) =>
    pipe(
      either.chain(t.string.validate(u, c), (s) =>
        pipe(
          s
            .replace(/^#/, "")
            .split("")
            .reverse(),
          (s) => (s.length === 3 ? s.concat(s) : s),
          A.chunksOf(2),
          A.map(
            flow(
              A.foldMapWithIndex(monoidSum)((i, a) =>
                pipe(handleHex(a), (x) => (i > 0 ? +x * (i * 16) : +x))
              ),
              t.number.decode
            )
          ),
          (a) => a.reverse(),
          A.array.sequence(either),
          E.map(([r = 0, g = 0, b = 0, a = 255]) => ({ r, g, b, a: a / 255 }))
        )
      )
    ),
  String
);

export const rgbToHsl = (rgb: RGBA): HSLA => {
  const { r, g, b, a } = rgb;
  const values = [r, g, b];
  const dec = multiply(255);
  const [max, min] = pipe(
    ["max", "min"],
    A.map((k) => pipe(Math[k](...values), div(255)))
  );
  if (max === min)
    return {
      h: 0,
      s: 0,
      l: max,
      a,
    };
  const maxIndex = pipe(max, dec, indexOf(values));
  const fromMax = flow(add(maxIndex), mod(3), (x) => values[x]);
  const l = percentage(avg(max, min));
  const s = percentage((max - min) / (l <= 50 ? max + min : 2 - max - min));
  const h = pipe(
    maxIndex * 2 + (fromMax(1) - fromMax(2)) / dec(max - min),
    deg
  );
  return {
    h,
    s,
    l,
    a,
  };
};
