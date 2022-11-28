package Model.Expressions;

import Model.Collections.Dictionary.IDictionary;
import Model.Types.Type;
import Model.Values.Value;

public class VariableExpression implements Expression {
    private String key;

    public VariableExpression(String key){ this.key = key; }

    public String getKey() { return key; }
    public void setKey(String key) { this.key = key; }

    @Override
    public Expression deepCopy(){
        return new VariableExpression(key);
    }

    @Override
    public Type typeCheck(IDictionary<String, Type> typeTable) { return typeTable.get(key); }

    @Override
    public Value evaluate(IDictionary<String, Value> symbolTable) { return symbolTable.get(key); }

    @Override
    public String toString() { return key; }
}
