package Model.Statements;

import Exceptions.InterpreterException;
import Model.Collections.IDictionary;
import Model.ProgramState.ProgramState;
import Model.Types.IntType;
import Model.Types.Type;
import Model.Value.IntValue;
import Model.Value.Value;
import javafx.util.Pair;

import java.util.List;

public class AwaitStatement implements Statement {
    private String variableName;

    public AwaitStatement(String variableName) {
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

            int variableInt = ((IntValue) variableValue).getValue();
            Pair<Integer, List<Integer>> barrierTableEntry = state.getBarrierTable().lookUp(variableInt);
            if (barrierTableEntry == null)
                throw new InterpreterException("Invalid barrier table location!");

            int barrierTableValue = barrierTableEntry.getKey();
            List<Integer> barrierPrograms = barrierTableEntry.getValue();

            if (barrierTableValue > barrierPrograms.size()) {
                if (!barrierPrograms.contains(state.getId()))
                    barrierPrograms.add(state.getId());
                state.getExeStack().push(this);
            }
        } catch (InterpreterException e) {
            throw new InterpreterException(e.getMessage());
        }

        return null;
    }

    @Override
    public Statement deepCopy() {
        return new AwaitStatement(variableName);
    }

    @Override
    public String toString() {
        return String.format("await(%s)", variableName);
    }
}
