export type Listener<P> = (payload: P) => void;
export type EventMapConstraint = Record<string, unknown>;

export class TypedEmitter<EventMap extends EventMapConstraint> {
  private listeners: { [K in keyof EventMap]?: Set<Listener<EventMap[K]>> } = {};

  on<K extends keyof EventMap>(event: K, fn: Listener<EventMap[K]>): () => void {
    (this.listeners[event] ??= new Set()).add(fn);
    return () => {
      this.listeners[event]?.delete(fn);
    };
  }

  once<K extends keyof EventMap>(event: K, fn: Listener<EventMap[K]>): () => void {
    const off = this.on(event, payload => {
      off();
      fn(payload);
    });
    return off;
  }

  emit<K extends keyof EventMap>(event: K, payload: EventMap[K]): void {
    this.listeners[event]?.forEach(fn => fn(payload));
  }
}
