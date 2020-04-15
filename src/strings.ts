import * as A from "fp-ts/lib/Array";
import { Endomorphism } from "fp-ts/lib/function";
import { pipe } from "fp-ts/lib/pipeable";
import { monoidAny } from "fp-ts/lib/Monoid";

type Search = string | RegExp;
type Replacement = [Search, string];

export const contains = (str: string) => (regexp: Search): boolean =>
  str.search(regexp) > 0;

export const matchesAny = (searches: Search[]) => (str: string): boolean =>
  pipe(searches, A.foldMap(monoidAny)(contains(str)));
export const replaceAll = (xs: Replacement[]): Endomorphism<string> => (x) =>
  pipe(
    xs,
    A.reduce(x, (b, a) => b.replace(...a))
  );

export const intToString = (x: number): string => x.toString();
