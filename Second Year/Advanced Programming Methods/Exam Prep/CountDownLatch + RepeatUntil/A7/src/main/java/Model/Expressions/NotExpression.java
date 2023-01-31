package Model.Expressions;

import Exceptions.InterpreterException;
import Model.Collections.IDictionary;
import Model.Collections.IHeap;
import Model.Types.BoolType;
import Model.Types.Type;
import Model.Value.BoolValue;
import Model.Value.Value;

public class NotExpression implements Expression {
    Expression expression;

    public NotExpression(Expression expression) {
        this.expression = expression;
    }

    @Override
    public Type typeCheck(IDictionary<String, Type> typeEnv) throws InterpreterException {
        Type type1;
        type1 = expression.typeCheck(typeEnv);
        if (type1.equals(new BoolType())) {
            return new BoolType();
        }else
            throw new InterpreterException("First operand is not an boolean");
    }

    @Override
    public Value eval(IDictionary<String, Value> table, IHeap heap) throws InterpreterException {
        Value v1;
        v1 = expression.eval(table, heap);
        if (v1.getType().equals(new BoolType())) {
            BoolValue b1 = (BoolValue) v1;
            boolean firstBool = b1.getValue();
            return new BoolValue(!firstBool);
        } else
            throw new InterpreterException("First operand is not an boolean");
    }

    @Override
    public Expression deepCopy() {
        return new NotExpression(expression.deepCopy());
    }

    @Override
    public String toString() {
        return "!" + expression.toString();
    }
}
