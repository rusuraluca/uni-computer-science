package Model.Collections;

import Exceptions.InterpreterException;
import javafx.util.Pair;

import java.util.List;

public interface ISemaphoreTable extends IDictionary<Integer, Pair<Integer, Pair<List<Integer>, Integer>>> {
    int put(Pair<Integer, Pair<List<Integer>, Integer>> value) throws InterpreterException;
    int getFirstFreeLocation();
}
