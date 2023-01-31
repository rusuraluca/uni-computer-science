package Model.Expressions;

import Exceptions.InterpreterException;
import Model.Types.Type;
import Model.Collections.MyIDictionary;
import Model.Collections.MyIHeap;
import Model.Value.Value;

public class VariableExpression implements Expression {
    String key;

    public VariableExpression(String key) {
        this.key = key;
    }

    @Override
    public Type typeCheck(MyIDictionary<String, Type> typeEnv) throws InterpreterException {
        return typeEnv.lookUp(key);
    }

    @Override
    public Value eval(MyIDictionary<String, Value> table, MyIHeap heap) throws InterpreterException {
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