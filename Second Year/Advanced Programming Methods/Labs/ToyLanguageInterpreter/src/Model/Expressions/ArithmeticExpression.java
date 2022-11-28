package Model.Expressions;

import Model.Collections.Dictionary.IDictionary;
import Exceptions.InvalidOperationException;
import Exceptions.ToyLanguageInterpreterException;
import Exceptions.IncompatibleTypesExceptions;
import Exceptions.DivisionByZero;
import Model.Types.Type;
import Model.Types.IntType;
import Model.Values.Value;
import Model.Values.IntValue;
import Model.Expressions.Enums.Operation;

public class ArithmeticExpression implements Expression {
    private Operation operation;
    private Expression expr1;
    private Expression expr2;

    public ArithmeticExpression(Operation operation, Expression expr1, Expression expr2){
        this.operation = operation;
        this.expr1 = expr1;
        this.expr2 = expr2;
    }

    public Operation getOperation() { return operation; }
    public void setOperation(Operation operation) { this.operation = operation; }

    public Expression getExpr1() { return expr1; }
    public void setExpr1(Expression expr1) { this.expr1 = expr1; }

    public Expression getExpr2() { return expr2; }
    public void setExpr2(Expression expr2) { this.expr2 = expr2; }

    @Override
    public Expression deepCopy(){
        return new ArithmeticExpression(operation, expr1.deepCopy(), expr2.deepCopy());
    }

    @Override
    public Type typeCheck(IDictionary<String, Type> typeTable) throws ToyLanguageInterpreterException {
        Type type1, type2;
        type1 = expr1.typeCheck(typeTable);
        type2 = expr2.typeCheck(typeTable);

        if (type1.equals(new IntType()))
            if (type2.equals(new IntType()))
                return new IntType();
            else
                throw new IncompatibleTypesExceptions("The second operand is not of type IntType!");
        else
            throw new IncompatibleTypesExceptions("The first operand is not of type IntType!");
    }

    private IntValue getValue(Expression expression, IDictionary<String, Value> symbolTable) throws ToyLanguageInterpreterException {
        Value value = expression.evaluate(symbolTable);

        if (value instanceof IntValue)
            return (IntValue) value;

        throw new IncompatibleTypesExceptions(String.format("%s is not of type IntType!", value.toString()));
    }

    @Override
    public Value evaluate(IDictionary<String, Value> symbolTable) throws ToyLanguageInterpreterException {
        IntValue exp1Value = getValue(expr1, symbolTable);
        IntValue exp2Value = getValue(expr2, symbolTable);

        switch (operation) {
            case SUM:
                return new IntValue(exp1Value.getValue() + exp2Value.getValue());
            case SUBTRACT:
                return new IntValue(exp1Value.getValue() - exp2Value.getValue());
            case MULTIPLY:
                return new IntValue(exp1Value.getValue() * exp2Value.getValue());
            case DIVIDE:
                if (exp2Value.getValue() == 0)
                    throw new DivisionByZero("Can't divide by zero.");
                return new IntValue(exp1Value.getValue() / exp2Value.getValue());
            default:
                throw new InvalidOperationException(String.format("Invalid operation %s between %s and %s!", operation, expr1.toString(), expr2.toString()));
        }
    }

    @Override
    public String toString(){
        String result = "(" + expr1.toString();

        switch(operation) {
            case SUM:
                result += "+";
                break;
            case SUBTRACT:
                result += "-";
                break;
            case MULTIPLY:
                result += "*";
                break;
            case DIVIDE:
                result += "/";
                break;
        }

        result += expr2.toString() + ")";

        return result;
    }
}
