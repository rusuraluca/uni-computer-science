package Model.Statements;

import Exceptions.InterpreterException;
import Model.Collections.IDictionary;
import Model.ProgramState.ProgramState;
import Model.Types.IntType;
import Model.Types.Type;
import Model.Value.IntValue;
import Model.Value.Value;

public class LatchAwaitStatement implements Statement {
    private String variableName;

    public LatchAwaitStatement(String variableName) {
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
        try {
            Value variableValue = state.getSymTable().lookUp(variableName);
            if (variableValue == null)
                throw new InterpreterException(String.format("Variable %s has not been declared!", variableName));
            if (!variableValue.getType().equals(new IntType()))
                throw new InterpreterException(String.format("Variable %s should be of integer type!", variableName));

            Integer latchLocation = ((IntValue) variableValue).getValue();
            Integer latchValue = state.getLatchTable().get(latchLocation);

            if (latchValue == null)
                throw new InterpreterException("Invalid latch table location!");
            if (latchValue != 0)
                state.getExeStack().push(this);

        } catch (InterpreterException e) {
            throw new InterpreterException(e.getMessage());
        }

        return null;
    }

    @Override
    public Statement deepCopy() {
        return new LatchAwaitStatement(variableName);
    }

    @Override
    public String toString() {
        return String.format("await(%s)", variableName);
    }
}
