import {flow} from 'fp-ts/lib/function'
import * as O from 'fp-ts/lib/Option'

type Maybe = <A, B extends A>(a: A) => (b: B | undefined) => A | B
export const maybe: Maybe = a =>
  flow(
    O.fromNullable,
    O.getOrElse(() => a)
  )
