package Model.Expressions;

import Exceptions.InterpreterException;
import Model.Types.Type;
import Model.Collections.IDictionary;
import Model.Collections.IHeap;
import Model.Value.Value;

public class VariableExpression implements Expression {
    String key;

    public VariableExpression(String key) {
        this.key = key;
    }

    @Override
    public Type typeCheck(IDictionary<String, Type> typeEnv) throws InterpreterException {
        return typeEnv.lookUp(key);
    }

    @Override
    public Value eval(IDictionary<String, Value> table, IHeap heap) throws InterpreterException {
        return table.lookUp(key);
    }

    @Override
    public Expression deepCopy() {
        return new VariableExpression(key);
    }

    @Override
    public String toString() {
        return key;
    }
}