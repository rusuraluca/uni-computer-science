package Model.Expressions;

import Exceptions.ExpressionEvaluationException;
import Exceptions.CollectionsException;
import Model.Collections.MyDictionary;
import Model.Types.BoolType;
import Model.Types.IType;
import Model.Types.IntType;
import Model.Collections.IDictionary;
import Model.Collections.IHeap;
import Model.Values.BoolValue;
import Model.Values.IntValue;
import Model.Values.IValue;

import java.util.Objects;

/**
 * Class for the Relational expression
 */
public class RelationalExpression implements IExpression {
    IExpression exp1;
    IExpression exp2;
    String op;

    public RelationalExpression(String op, IExpression exp1, IExpression exp2) {
        this.exp1 = exp1;
        this.exp2 = exp2;
        this.op = op;
    }

    @Override
    public IType typecheck(IDictionary<String, IType> typeEnv) throws CollectionsException, ExpressionEvaluationException{
        IType type1, type2;
        type1 = exp1.typecheck(typeEnv);
        type2 = exp2.typecheck(typeEnv);

        if(type1.equals(new IntType())) {
            if (type2.equals(new IntType())) {
                return new BoolType();
            } else {
                throw new ExpressionEvaluationException("Second operand is not an integer");
            }
        } else {
            throw new ExpressionEvaluationException("First operand is not an integer");
        }
    }

    @Override
    public IValue eval(IDictionary<String, IValue> tbl, IHeap heap) throws CollectionsException, ExpressionEvaluationException {
        IValue v1, v2;
        v1 = this.exp1.eval(tbl, heap);

        if (v1.getType().equals(new IntType())) {
            v2 = this.exp2.eval(tbl, heap);

            if (v2.getType().equals(new IntType())) {
                IntValue i1 = (IntValue) v1;
                IntValue i2 = (IntValue) v2;
                int n1, n2;
                n1 = i1.getValue();
                n2 = i2.getValue();

                if (Objects.equals(this.op, "<"))
                    return new BoolValue(n1 < n2);
                else if (Objects.equals(this.op, "<="))
                    return new BoolValue(n1 <= n2);
                else if (Objects.equals(this.op, "=="))
                    return new BoolValue(n1 == n2);
                else if (Objects.equals(this.op, "!="))
                    return new BoolValue(n1 != n2);
                else if (Objects.equals(this.op, ">="))
                    return new BoolValue(n1 >= n2);
                else if (Objects.equals(this.op, ">"))
                    return new BoolValue(n1 > n2);
            } else
                throw new ExpressionEvaluationException("Second operand is not an integer.");
        }
        else
            throw new ExpressionEvaluationException("First operand is not an integer.");

        return null;
    }

    @Override
    public String toString() {
        return exp1.toString() + " " + op + " " + exp2.toString();
    }
}

