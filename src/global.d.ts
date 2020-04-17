import * as C from 'io-ts/lib/Codec'
import * as D from 'io-ts/lib/Decoder'
import * as E from 'io-ts/lib/Encoder'

export type Encoder<A> = E.Encoder<A>
export type Decoder<A> = D.Decoder<A>
export type Codec<A> = C.Codec<A>
