package Model.Expressions;

import Model.Collections.Dictionary.IDictionary;
import Model.Types.Type;
import Model.Values.Value;

public class ValueExpression implements Expression {
    private Value value;

    public ValueExpression(Value value){ this.value = value; }

    public Value getValue() { return value; }
    public void setValue(Value value) { this.value = value; }

    @Override
    public Expression deepCopy(){
        return new ValueExpression(value);
    }

    @Override
    public Type typeCheck(IDictionary<String, Type> typeTable) { return value.getType(); }

    @Override
    public Value evaluate(IDictionary<String, Value> symbolTable) { return value; }

    @Override
    public String toString(){ return value.toString(); }
}
