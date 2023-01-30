package Model.Expressions;

import Exceptions.InterpreterException;
import Model.Types.Type;
import Model.Collections.IDictionary;
import Model.Collections.IHeap;
import Model.Value.Value;

public class ValueExpression implements Expression {
    Value value;

    public ValueExpression(Value value) {
        this.value = value;
    }

    @Override
    public Type typeCheck(IDictionary<String, Type> typeEnv) throws InterpreterException {
        return value.getType();
    }

    @Override
    public Value eval(IDictionary<String, Value> table, IHeap heap) {
        return this.value;
    }

    @Override
    public Expression deepCopy() {
        return new ValueExpression(value);
    }

    @Override
    public String toString() {
        return this.value.toString();
    }
}