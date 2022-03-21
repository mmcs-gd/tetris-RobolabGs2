export type MapOfArrays<T> = {
    [K in keyof T]: T[K][]
}

export type EventHandler<T, This = unknown, Return = void> = {
    [K in keyof T]: (this: This, data: T[K]) => Return
}

type ListenersMap<EventsMap, This = unknown> = MapOfArrays<EventHandler<EventsMap, This>>;

export class Observable<EventsMap> {
    protected listeners: ListenersMap<EventsMap, this> = new Proxy<ListenersMap<EventsMap, this>>({} as ListenersMap<EventsMap, this>, {
        get: (map, propertyName, receiver) => {
            let property = Reflect.get(map, propertyName, receiver);
            if (property !== undefined)
                return property;
            property = [];
            Reflect.set(map, propertyName, property, receiver);
            return property;
        }
    });
    // Возвращает индекс слушателя
    public addEventListener<E extends keyof EventsMap>(eventType: E, listener: EventHandler<EventsMap, this>[E]): number {
        return this.listeners[eventType].push(listener) - 1;
    }
    // Удаляет слушателя по индексу
    public removeEventListener<E extends keyof EventsMap>(eventType: E, listener: number) {
        delete (this.listeners[eventType][listener]);
    }
    protected dispatchEvent<E extends keyof EventsMap>(eventType: E, event: EventsMap[E]) {
        this.listeners[eventType].forEach(listener => listener.call(this, event));
    }
}