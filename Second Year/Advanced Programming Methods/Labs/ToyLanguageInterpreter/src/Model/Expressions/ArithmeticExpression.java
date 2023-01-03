package Model.Expressions;

import Exceptions.ExpressionEvaluationException;
import Exceptions.CollectionsException;

import Model.Collections.MyDictionary;
import Model.Enums.Operation;
import Model.Types.IType;
import Model.Types.IntType;
import Model.Collections.IDictionary;
import Model.Collections.IHeap;
import Model.Values.IntValue;
import Model.Values.IValue;

/**
 * Class for the Arithmetic expression
 */
public class ArithmeticExpression implements IExpression {
    IExpression e1;
    IExpression e2;
    Operation op;

    public ArithmeticExpression(Operation op, IExpression e1, IExpression e2) {
        this.e1 = e1;
        this.e2 = e2;
        this.op = op;
    }

    @Override
    public IValue eval(IDictionary<String, IValue> tbl, IHeap heap) throws ExpressionEvaluationException, CollectionsException {
        IValue v1, v2;
        v1 = this.e1.eval(tbl, heap);

        if (v1.getType().equals(new IntType())) {
            v2 = this.e2.eval(tbl, heap);

            if (v2.getType().equals(new IntType())) {
                IntValue i1 = (IntValue) v1;
                IntValue i2 = (IntValue) v2;
                int n1, n2;
                n1 = i1.getValue();
                n2 = i2.getValue();

                switch (this.op) {
                    case SUM -> {
                        return new IntValue(n1 + n2);
                    }
                    case SUBTRACT -> {
                        return new IntValue(n1 - n2);
                    }
                    case MULTIPLY -> {
                        return new IntValue(n1 * n2);
                    }
                    case DIVIDE -> {
                        if (n2 == 0) throw new ExpressionEvaluationException("Division by zero.");
                        else return new IntValue(n1 / n2);
                    }
                }
            } else
                throw new ExpressionEvaluationException("Second operand is not an integer");
        } else
            throw new ExpressionEvaluationException("First operand is not an integer.");
        return null;
    }

    @Override
    public IType typecheck(IDictionary<String, IType> typeEnv) throws CollectionsException, ExpressionEvaluationException{
        IType type1, type2;
        type1 = e1.typecheck(typeEnv);
        type2 = e2.typecheck(typeEnv);

        if(type1.equals(new IntType())) {
            if (type2.equals(new IntType())) {
                return new IntType();
            } else {
                throw new ExpressionEvaluationException("Second operand is not an integer");
            }
        } else {
            throw new ExpressionEvaluationException("First operand is not an integer");
        }
    }

    @Override
    public String toString() {
        String result = "";
        switch (this.op) {
            case SUM -> result = " + ";
            case SUBTRACT -> result = " - ";
            case MULTIPLY -> result = " * ";
            case DIVIDE -> result = " / ";
        }
        return this.e1.toString() + result + this.e2.toString();
    }
}
