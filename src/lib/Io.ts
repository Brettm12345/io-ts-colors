import * as E from 'fp-ts/lib/Either'
import {Either} from 'fp-ts/lib/Either'
import {NonEmptyArray} from 'fp-ts/lib/NonEmptyArray'
import {Tree} from 'fp-ts/lib/Tree'
import {Decoder} from 'io-ts/lib/Decoder'
import {flow} from 'fp-ts/lib/function'

type FormatError = <A>(
  a: Either<NonEmptyArray<Tree<string>>, A>
) => Either<string, A>
export const formatError: FormatError = E.mapLeft(JSON.stringify)

type DecodeWithError = <T, D extends Decoder<T>>(
  x: D
) => (a: unknown) => Either<string, T>
export const decodeWithError: DecodeWithError = x => flow(x.decode, formatError)
