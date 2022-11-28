package Model.Statements;

import Model.Collections.Dictionary.IDictionary;
import Exceptions.IncompatibleTypesExceptions;
import Exceptions.ToyLanguageInterpreterException;
import Exceptions.VariableNotFoundException;
import Model.Types.Type;
import Model.Values.Value;
import Model.Expressions.Expression;
import Model.ProgramState;

public class AssignmentStmt implements IStmt{
    String key;
    Expression expr;

    public AssignmentStmt(String key, Expression expr) {
        this.key = key;
        this.expr = expr;
    }

    @Override
    public IStmt deepCopy() {
        return new AssignmentStmt(key, expr.deepCopy());
    }

    @Override
    public IDictionary<String, Type> typeCheck(IDictionary<String, Type> typeTable) throws ToyLanguageInterpreterException {
        if (!typeTable.get(key).equals(expr.typeCheck(typeTable)))
            throw new IncompatibleTypesExceptions("Right size and left side have different types!");

        return typeTable;
    }

    @Override
    public ProgramState execute(ProgramState state) throws ToyLanguageInterpreterException {
        IDictionary<String, Value> symbolTable = state.getSymbolTable();

        Value val = expr.evaluate(symbolTable);
        Type type = symbolTable.get(key).getType();

        if (!val.getType().equals(type))
            throw new IncompatibleTypesExceptions(String.format("%s is not compatible with %s!", val.toString(), type.toString()));

        if (!symbolTable.containsKey(key))
            throw new VariableNotFoundException(String.format("%s does not exist in the Symbol Table!", key));

        symbolTable.put(key, val);

        return state;
    }

    public String toString() { return key + "=" + expr.toString(); }
}
