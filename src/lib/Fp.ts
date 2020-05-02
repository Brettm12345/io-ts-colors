import {Endomorphism as Endo, FunctionN as FN} from 'fp-ts/lib/function'
import {Decoder} from 'io-ts/lib/Decoder'

export type Decoded<T> = ReturnType<Decoder<T>['decode']>
export type Builder<T> = FN<number[], Decoded<T>>
export type ISO<A, B> = (x: A) => B
export type CurriedEndo<A> = (x: A) => Endo<A>
export type Reduction<A> = (xs: A[]) => A
export type Functions<A> = Record<string, CurriedEndo<A>>
export type Reductions<A> = Record<string, ISO<A[], A>>
