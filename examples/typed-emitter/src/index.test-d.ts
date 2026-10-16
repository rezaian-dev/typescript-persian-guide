import { TypedEmitter } from "./emitter.js";

type Expect<T extends true> = T;
type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2)
  ? true
  : false;

type Events = {
  msg: { text: string };
  tick: undefined;
};
const bus = new TypedEmitter<Events>();

// ۱) payload درست استنتاج می‌شود:
bus.on("msg", p => {
  type _T1 = Expect<Equal<typeof p, { text: string }>>;
});

// ۲) unsubscribe برمی‌گردد:
const off = bus.on("tick", () => {});
type _T2 = Expect<Equal<typeof off, () => void>>;

// ۳) رویداد ناشناخته رد می‌شود:
// @ts-expect-error — "nope" عضو Events نیست
bus.on("nope", () => {});

// ۴) payload غلط رد می‌شود:
// @ts-expect-error — text باید string باشد
bus.emit("msg", { text: 42 });

export {};
