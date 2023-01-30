package Model.Expressions;

import Exceptions.InterpreterException;
import Model.Types.BoolType;
import Model.Types.Type;
import Model.Collections.IDictionary;
import Model.Collections.IHeap;
import Model.Values.BoolValue;
import Model.Values.Value;

import java.util.Objects;

public class LogicExpression implements Expression {
    Expression expression1;
    Expression expression2;
    String operation;

    public LogicExpression(String operation, Expression expression1, Expression expression2) {
        this.expression1 = expression1;
        this.expression2 = expression2;
        this.operation = operation;
    }

    @Override
    public Type typeCheck(IDictionary<String, Type> typeEnv) throws InterpreterException {
        Type type1, type2;
        type1 = expression1.typeCheck(typeEnv);
        type2 = expression2.typeCheck(typeEnv);
        if (type1.equals(new BoolType())) {
            if (type2.equals(new BoolType())) {
                return new BoolType();
            } else
                throw new InterpreterException("Second operand is not a boolean.");
        } else
            throw new InterpreterException("First operand is not a boolean.");

    }

    @Override
    public Value eval(IDictionary<String, Value> table, IHeap heap) throws InterpreterException {
        Value value1, value2;
        value1 = this.expression1.eval(table, heap);
        if (value1.getType().equals(new BoolType())) {
            value2 = this.expression2.eval(table, heap);
            if (value2.getType().equals(new BoolType())) {
                BoolValue bool1 = (BoolValue) value1;
                BoolValue bool2 = (BoolValue) value2;
                boolean b1, b2;
                b1 = bool1.getValue();
                b2 = bool2.getValue();
                if (Objects.equals(this.operation, "and")) {
                    return new BoolValue(b1 && b2);
                } else if (Objects.equals(this.operation, "or")) {
                    return new BoolValue(b1 || b2);
                }
            } else {
                throw new InterpreterException("Second operand is not a boolean.");
            }
        } else {
            throw new InterpreterException("First operand is not a boolean.");
        }
        return null;
    }

    @Override
    public Expression deepCopy() {
        return new LogicExpression(operation, expression1.deepCopy(), expression2.deepCopy());
    }

    @Override
    public String toString() {
        return expression1.toString() + " " + operation + " " + expression2.toString();
    }
}