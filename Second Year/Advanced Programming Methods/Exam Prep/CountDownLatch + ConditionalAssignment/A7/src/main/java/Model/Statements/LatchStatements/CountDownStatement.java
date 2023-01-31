package Model.Statements.LatchStatements;

import Exceptions.InterpreterException;
import Model.Collections.IDictionary;
import Model.ProgramState.ProgramState;
import Model.Statements.Statement;
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
    public ProgramState execute(ProgramState state) throws InterpreterException {
        Value variableValue = state.getSymTable().lookUp(variableName);
        // if var is not in symbol table, or it has not the type int then print an error message and terminate the execution.
        if (variableValue == null)
            throw new InterpreterException(String.format("Variable '%s' has not been declared", variableName));
        if (!variableValue.getType().equals(new IntType()))
            throw new InterpreterException(String.format("Variable '%s' should be of integer type", variableName));

        ProgramState.lock.lock();

        // latchLocation = lookup(symbolTable,var)
        Integer latchLocation = ((IntValue) variableValue).getValue();
        Integer latchValue = state.getLatchTable().get(latchLocation);

        // if latchLocation is not an index in the LatchTable then
        if (latchValue == null) {
            ProgramState.lock.unlock();
            throw new InterpreterException("Invalid latch table location!");
        }
        // if LatchTable[latchLocation] > 0 then
        if (latchValue > 0)
            // LatchTable[latchLocation]=LatchTable[latchLocation]-1;
            state.getLatchTable().update(latchLocation, latchValue-1);

        // write into out table the current programState id
        state.getOut().add(new IntValue(state.getId()));

        ProgramState.lock.unlock();

        return null;
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
    public Statement deepCopy() {
        return new CountDownStatement(variableName);
    }

    @Override
    public String toString() {
        return String.format("countDown(%s)", variableName);
    }
}
