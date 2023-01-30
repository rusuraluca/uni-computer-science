package Model.Statements;

import Exceptions.InterpreterException;
import Model.Expressions.Expression;
import Model.ProgramState.ProgramState;
import Model.Types.RefType;
import Model.Types.Type;
import Model.Collections.IDictionary;
import Model.Collections.IHeap;
import Model.Values.RefValue;
import Model.Values.Value;

public class NewStatement implements Statement {
    private final String varName;
    private final Expression expression;

    public NewStatement(String varName, Expression expression) {
        this.varName = varName;
        this.expression = expression;
    }

    @Override
    public ProgramState execute(ProgramState state) throws InterpreterException {
        IDictionary<String, Value> symTable = state.getSymTable();
        IHeap heap = state.getHeap();
        if (symTable.isDefined(varName)) {
            Value varValue = symTable.lookUp(varName);
            if ((varValue.getType() instanceof RefType)) {
                Value evaluated = expression.eval(symTable, heap);
                Type locationType = ((RefValue) varValue).getLocationType();
                if (locationType.equals(evaluated.getType())) {
                    int newPosition = heap.add(evaluated);
                    symTable.put(varName, new RefValue(newPosition, locationType));
                    state.setSymTable(symTable);
                    state.setHeap(heap);
                } else
                    throw new InterpreterException(String.format("%s not of %s", varName, evaluated.getType()));
            } else {
                throw new InterpreterException(String.format("%s in not of RefType", varName));
            }
        } else {
            throw new InterpreterException(String.format("%s not in symTable", varName));
        }
        return null;
    }

    @Override
    public IDictionary<String, Type> typeCheck(IDictionary<String, Type> typeEnv) throws InterpreterException{
        Type typeVar = typeEnv.lookUp(varName);
        Type typeExpr = expression.typeCheck(typeEnv);
        if (typeVar.equals(new RefType(typeExpr)))
            return typeEnv;
        else
            throw new InterpreterException("NEW Statements: right hand side and left hand side have different types.");
    }

    @Override
    public Statement deepCopy() {
        return new NewStatement(varName, expression.deepCopy());
    }

    @Override
    public String toString() {
        return String.format("new(%s, %s)", varName, expression);
    }
}