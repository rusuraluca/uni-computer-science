package Model.Statements;

import Exceptions.CollectionsException;
import Exceptions.ExpressionEvaluationException;
import Exceptions.StatementExecutionException;

import Model.ProgramState.ProgramState;

import Model.Collections.IDictionary;
import Model.Values.IValue;
import Model.Types.IType;

/**
 * Class that represents the Declaration statement
 */
public class DeclarationStatement implements IStatement {
    String name;
    IType type;

    public DeclarationStatement(String name, IType type) {
        this.name = name;
        this.type = type;
    }

    @Override
    public ProgramState execute(ProgramState state) throws StatementExecutionException {
        IDictionary<String, IValue> symbolTable = state.getSymbolTable();

        if (symbolTable.containsKey(name))
            throw new StatementExecutionException("Variable " + name + " already declared!");

        symbolTable.put(name, type.defaultValue());
        state.setSymbolTable(symbolTable);
        return state;
    }

    @Override
    public IDictionary<String, IType> typecheck(IDictionary<String, IType> typeEnv) throws CollectionsException, ExpressionEvaluationException, StatementExecutionException {
        typeEnv.put(name, type);
        return typeEnv;
    }

    @Override
    public String toString() {
        return type.toString() + " " + name;
    }
}
