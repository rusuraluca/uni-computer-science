package Model.Expressions;

import Model.Collections.Dictionary.IDictionary;
import Exceptions.IncompatibleTypesExceptions;
import Exceptions.IncompatibleValuesExceptions;
import Exceptions.InvalidOperatorException;
import Exceptions.ToyLanguageInterpreterException;
import Model.Types.IntType;
import Model.Types.Type;
import Model.Values.IntValue;
import Model.Values.Value;
import Model.Values.BoolValue;
import Model.Expressions.Enums.Operator;

public class RelationalExpression implements Expression {
    private Operator operator;
    private Expression expr1;
    private Expression expr2;

    public RelationalExpression(Operator operator, Expression expr1, Expression expr2) {
        this.operator = operator;
        this.expr1 = expr1;
        this.expr2 = expr2;
    }

    public Operator getOperator() {
        return operator;
    }
    public void setOperator(Operator operator) {
        this.operator = operator;
    }

    public Expression getExpr1() {
        return expr1;
    }
    public void setExpr1(Expression expr1) {
        this.expr1 = expr1;
    }

    public Expression getExpr2() {
        return expr2;
    }
    public void setExpr2(Expression expr2) {
        this.expr2 = expr2;
    }

    @Override
    public Expression deepCopy(){
        return new RelationalExpression(operator, expr1.deepCopy(), expr2.deepCopy());
    }

    @Override
    public Type typeCheck(IDictionary<String, Type> typeTable) throws ToyLanguageInterpreterException {
        Type type1, type2;
        type1 = expr1.typeCheck(typeTable);
        type2 = expr2.typeCheck(typeTable);
        if (type1.equals(new IntType())) {
            if (type2.equals(new IntType()))
                return new IntType();
            else
                throw new IncompatibleTypesExceptions("The second operand is not an int!");
        }else
            throw new IncompatibleTypesExceptions("The first operand is not an int!");
    }

    private IntValue getValue(Expression expression, IDictionary<String, Value> symTable) throws ToyLanguageInterpreterException {
        Value value = expression.evaluate(symTable);

        if (value instanceof IntValue)
            return (IntValue) value;

        throw new IncompatibleValuesExceptions(String.format("%s is not of type BoolType!", value.toString()));
    }

    @Override
    public Value evaluate(IDictionary<String, Value> symbolTable) throws ToyLanguageInterpreterException {
        IntValue expr1Value = getValue(expr1, symbolTable);
        IntValue expr2Value = getValue(expr2, symbolTable);

        boolean evalResult;

        return switch (this.operator) {
            case SMALLER -> new BoolValue(expr1Value.getValue() < expr2Value.getValue());
            case SMALLER_EQUAL -> new BoolValue(expr1Value.getValue() <= expr2Value.getValue());

            case EQUAL -> new BoolValue(expr1Value.getValue() == expr2Value.getValue());
            case NOT_EQUAL -> new BoolValue(expr1Value.getValue() != expr2Value.getValue());

            case GREATER -> new BoolValue(expr1Value.getValue() > expr2Value.getValue());
            case GREATER_EQUAL -> new BoolValue(expr1Value.getValue() >= expr2Value.getValue());

            default -> throw new InvalidOperatorException(String.format("Invalid operator %s between %s and %s!",  operator,  expr1Value.toString(), expr2Value.toString()));
        };
    }

    @Override
    public String toString(){
        String result = "(" + this.expr1.toString();

        switch (this.operator) {
            case SMALLER -> result += " < ";
            case SMALLER_EQUAL -> result += " <= ";
            case EQUAL -> result += " == ";
            case NOT_EQUAL -> result += " != ";
            case GREATER -> result += " > ";
            case GREATER_EQUAL -> result += " >= ";
        }

        result += this.expr2.toString() + ")";

        return result;
    }
}
