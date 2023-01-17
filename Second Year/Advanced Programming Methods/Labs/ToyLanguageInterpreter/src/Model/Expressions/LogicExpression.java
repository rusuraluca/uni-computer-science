package Model.Expressions;

import Exceptions.ExpressionEvaluationException;
import Exceptions.CollectionsException;

import Model.Collections.IDictionary;
import Model.Collections.IHeap;
import Model.Collections.MyDictionary;
import Model.Enums.Operation;
import Model.Enums.Operator;
import Model.Statements.File.OpenReadFile;
import Model.Types.IType;
import Model.Types.IntType;
import Model.Values.IValue;

import Model.Types.BoolType;
import Model.Values.BoolValue;

import java.util.Objects;

/**
 * Class for the Logic expression
 */
public class LogicExpression implements IExpression {
    IExpression e1;
    IExpression e2;
    Operator op;

    public LogicExpression(IExpression e1, IExpression e2, Operator op) {
        this.e1 = e1;
        this.e2 = e2;
        this.op = op;
    }

    public IType typecheck(IDictionary<String, IType> typeEnv) throws CollectionsException, ExpressionEvaluationException{
        IType type1, type2;
        type1 = e1.typecheck(typeEnv);
        type2 = e2.typecheck(typeEnv);

        if(type1.equals(new BoolType())) {
            if (type2.equals(new BoolType())) {
                return new BoolType();
            } else {
                throw new ExpressionEvaluationException("Second operand is not a boolean");
            }
        } else {
            throw new ExpressionEvaluationException("First operand is not a boolean");
        }
    }

    @Override
    public IValue eval(IDictionary<String, IValue> tbl, IHeap heap) throws CollectionsException, ExpressionEvaluationException {
        IValue v1, v2;
        v1 = this.e1.eval(tbl, heap);

        if (v1.getType().equals(new BoolType())) {
            v2 = this.e2.eval(tbl, heap);

            if (v2.getType().equals(new BoolType())) {
                BoolValue i1 = (BoolValue) v1;
                BoolValue i2 = (BoolValue) v2;
                boolean n1, n2;
                n1 = i1.getVal();
                n2 = i2.getVal();

                switch (this.op) {
                    case AND -> new BoolValue(n1 && n2);
                    case OR -> new BoolValue(n1 || n2);
                    default -> throw new ExpressionEvaluationException(String.format("Invalid operator %s between %s and %s!",  op,  i1.toString(), i2.toString()));
                }
            } else
                throw new ExpressionEvaluationException("Second operand is not a boolean.");
        }
        else
            throw new ExpressionEvaluationException("First operand is not a boolean.");

        return null;
    }

    @Override
    public String toString() {
        String result = "";
        switch (this.op) {
            case AND -> result = " & ";
            case OR -> result = " || ";
        }
        return this.e1.toString() + result + this.e2.toString();
    }
}
