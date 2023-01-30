package Model.Expressions;

import Exceptions.InterpreterException;
import Model.Types.Type;
import Model.Collections.MyIDictionary;
import Model.Collections.MyIHeap;
import Model.Value.Value;

public class ValueExpression implements Expression {
    Value value;

    public ValueExpression(Value value) {
        this.value = value;
    }

    @Override
    public Type typeCheck(MyIDictionary<String, Type> typeEnv) throws InterpreterException {
        return value.getType();
    }

    @Override
    public Value eval(MyIDictionary<String, Value> table, MyIHeap heap) {
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