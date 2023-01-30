package Model.Expressions;

import Exceptions.InterpreterException;
import Model.Types.IntType;
import Model.Types.Type;
import Model.Collections.IDictionary;
import Model.Collections.IHeap;
import Model.Values.IntValue;
import Model.Values.Value;

public class ArithmeticExpression implements Expression {
    Expression expression1;
    Expression expression2;
    char operation;

    public ArithmeticExpression(char operation, Expression expression1, Expression expression2) {
        this.expression1 = expression1;
        this.expression2 = expression2;
        this.operation = operation;
    }

    @Override
    public Type typeCheck(IDictionary<String, Type> typeEnv) throws InterpreterException {
        Type type1, type2;
        type1 = expression1.typeCheck(typeEnv);
        type2 = expression2.typeCheck(typeEnv);
        if (type1.equals(new IntType())) {
            if (type2.equals(new IntType())) {
                return new IntType();
            } else
                throw new InterpreterException("Second operand is not an integer.");
        } else
            throw new InterpreterException("First operand is not an integer.");
    }

    @Override
    public Value eval(IDictionary<String, Value> table, IHeap heap) throws InterpreterException {
        Value value1, value2;
        value1 = this.expression1.eval(table, heap);
        if (value1.getType().equals(new IntType())) {
            value2 = this.expression2.eval(table, heap);
            if (value2.getType().equals(new IntType())) {
                IntValue int1 = (IntValue) value1;
                IntValue int2 = (IntValue) value2;
                int n1, n2;
                n1 = int1.getValue();
                n2 = int2.getValue();
                if (this.operation == '+')
                    return new IntValue(n1 + n2);
                else if (this.operation == '-')
                    return new IntValue(n1 - n2);
                else if (this.operation == '*')
                    return new IntValue(n1 * n2);
                else if (this.operation == '/')
                    if (n2 == 0)
                        throw new InterpreterException("Division by zero.");
                    else
                        return new IntValue(n1 / n2);
            } else
                throw new InterpreterException("Second operand is not an integer.");
        } else
            throw new InterpreterException("First operand is not an integer.");
        return null;
    }

    @Override
    public Expression deepCopy() {
        return new ArithmeticExpression(operation, expression1.deepCopy(), expression2.deepCopy());
    }

    @Override
    public String toString() {
        return expression1.toString() + " " + operation + " " + expression2.toString();
    }
}