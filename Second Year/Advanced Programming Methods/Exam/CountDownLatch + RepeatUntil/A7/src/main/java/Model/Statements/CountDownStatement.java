package Model.Statements;

import Exceptions.InterpreterException;
import Model.Collections.IDictionary;
import Model.ProgramState.ProgramState;
import Model.Types.IntType;
import Model.Types.Type;
import Model.Value.IntValue;
import Model.Value.Value;

public class CountDownStatement implements Statement {
    private String variableName;


    public CountDownStatement(String variableName) {
        this.variableName = variableName;
    }

    @Override
    public IDictionary<String, Type> typeCheck(IDictionary<String, Type> typeTable) throws InterpreterException {
        try {
            Type variableType = typeTable.lookUp(variableName);
            if (variableType == null)
                throw new InterpreterException(String.format("Variable %s has not been declared!", variableName));
            if (!variableType.equals(new IntType()))
                throw new InterpreterException(String.format("Variable %s should be of integer type!", variableName));

        } catch (InterpreterException e) {
            throw new InterpreterException(e.getMessage());
        }

        return typeTable;
    }

    @Override
    public ProgramState execute(ProgramState state) throws InterpreterException {
        Value variableValue = state.getSymTable().lookUp(variableName);
        if (variableValue == null)
            throw new InterpreterException(String.format("Variable '%s' has not been declared", variableName));
        if (!variableValue.getType().equals(new IntType()))
            throw new InterpreterException(String.format("Variable '%s' should be of integer type", variableName));

        Integer latchLocation = ((IntValue) variableValue).getValue();
        Integer latchValue = state.getLatchTable().get(latchLocation);

        if (latchValue == null)
            throw new InterpreterException("Invalid latch table location!");
        if (latchValue > 0)
            state.getLatchTable().update(latchLocation, latchValue-1);

        state.getOut().add(new IntValue(state.getId()));
        return null;
    }

    @Override
    public Statement deepCopy() {
        return new CountDownStatement(variableName);
    }

    @Override
    public String toString() {
        return String.format("countDown(%s)", variableName);
    }
}
