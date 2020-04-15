import * as A from "fp-ts/lib/Array";
import * as E from "fp-ts/lib/Either";
import { either } from "fp-ts/lib/Either";
import { monoidAll, monoidSum } from "fp-ts/lib/Monoid";
import { pipe } from "fp-ts/lib/pipeable";
import * as t from "io-ts";
import { flow, FunctionN as FN } from "fp-ts/lib/function";
import { percent, avg, isBetween, replaceAll } from "./util";

export type RGB = Record<"r" | "g" | "b", number>;
export type HSL = Record<"h" | "s" | "l", number>;

type ColorBuilder<T> = FN<[number, number, number], T>;
export const rgb: ColorBuilder<RGB> = (r, g, b) => ({
  r,
  g,
  b,
});

export const hsl: ColorBuilder<HSL> = (h, s, l): HSL => ({
  h,
  s,
  l,
});

const hexDigit = replaceAll(
  ["a", "b", "c", "d", "e", "f"].map((a, i) => [a, (i + 10).toString()])
);

export const HexString = new t.Type<RGB, string, unknown>(
  "HexString",
  (x): x is RGB =>
    A.foldMap(monoidAll)(isBetween(0, 255))(Object.values(x)) &&
    Object.keys(x) === ["r", "g", "b"],
  (u, c) =>
    pipe(
      either.chain(t.string.validate(u, c), (s) =>
        pipe(
          s
            .replace(/^#/, "")
            .split("")
            .reverse(),
          (s) => (s.length === 3 ? s.concat(s) : s), // handle shorthand colors IE: #fff
          A.chunksOf(2),
          A.map(
            flow(
              A.foldMapWithIndex(monoidSum)((i, a) =>
                pipe(hexDigit(a), (x) => (i > 0 ? +x * (i * 16) : +x))
              ),
              t.number.decode
            )
          ),
          A.reverse,
          A.array.sequence(either),
          E.map(([r, g, b]) => ({ r, g, b }))
        )
      )
    ),
  String
);

export const rgbToHsl = ({ r, g, b }: RGB): HSL => {
  const tuple = [r, g, b];
  const [max, min] = ["max", "min"].map((k) => Math[k](...tuple) / 255);
  const delta = max - min;
  const sum = max + min;
  if (delta === 0)
    return {
      h: 0,
      s: 0,
      l: max,
    };
  const maxIndex = tuple.indexOf(max * 255);
  const fromMax = (x: number) => tuple[(maxIndex + x) % 3];
  const l = percent(avg(max, min));
  return {
    h: Math.round(
      (60 * (2 * maxIndex + (fromMax(1) - fromMax(2)) / (delta * 255))) % 360
    ),
    s: percent(delta / (l > 50 ? 2 - delta : sum)),
    l,
  };
};
