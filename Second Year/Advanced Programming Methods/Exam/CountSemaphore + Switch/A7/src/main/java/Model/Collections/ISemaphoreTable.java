package Model.Collections;

import Exceptions.InterpreterException;
import javafx.util.Pair;

import java.util.List;

public interface ISemaphoreTable extends IDictionary<Integer, Pair<Integer, List<Integer>>> {
    int put(Pair<Integer, List<Integer>> value) throws InterpreterException;
    int getFirstFreeLocation();
}
