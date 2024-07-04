package domain;

import java.util.Objects;

public class Pair<E, F> {
    private E object1;
    private F object2;

    public Pair(E object1, F object2) {
        this.object1 = object1;
        this.object2 = object2;
    }

    public E getObject1() {
        return object1;
    }

    public F getObject2() {
        return object2;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Pair<E, F> pair = (Pair<E, F>) o;
        return Objects.equals(object1, pair.object1) && Objects.equals(object2, pair.object2);
    }

    @Override
    public int hashCode() {
        return Objects.hash(object1, object2);
    }
}
