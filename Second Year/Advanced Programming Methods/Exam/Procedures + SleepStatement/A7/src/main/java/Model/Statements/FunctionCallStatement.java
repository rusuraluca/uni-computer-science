package Model.Statements;


import Exceptions.InterpreterException;
import Model.Collections.MyDictionary;
import Model.Collections.MyIDictionary;
import Model.Collections.MyList;
import Model.Expressions.Expression;
import Model.ProgramState.ProgramState;
import Model.Types.Type;
import Model.Value.Value;
import javafx.util.Pair;

import java.util.List;
import java.util.Vector;

public class FunctionCallStatement implements Statement {
    private String functionName;
    private MyList<Expression> parameters;

    public FunctionCallStatement(String functionName, List<Expression> parameters) {
        this.functionName = functionName;
        this.parameters = new MyList<Expression>();

        for (int i = 0; i < parameters.size(); ++i) {
            this.parameters.add(parameters.get(i));
        }
    }

    @Override
    public ProgramState execute(ProgramState state) throws InterpreterException {
        try {
            Pair<List<String>, Statement> functionEntry = state.getProcedureTable().lookUp(functionName);
            if (functionEntry == null)
                throw new InterpreterException(String.format("Function '%s' does not exist!", functionName));

            List<String> paramNames = functionEntry.getKey();
            Statement functionBody = functionEntry.getValue();

            List<Value> paramValues = new Vector<Value>();
            for (int i = 0; i < parameters.size(); ++i)
                paramValues.add(parameters.get(i).eval(state.getSymTable(), state.getHeap()));

            MyIDictionary<String, Value> newSymbolsTable = new MyDictionary<>();
            int size = paramNames.size();
            for (int i = 0; i < size; ++i)
                newSymbolsTable.put(paramNames.get(i), paramValues.get(i));

            state.getAllSymTables().push(newSymbolsTable);
            state.getExeStack().push(new FunctionReturnStatement());
            state.getExeStack().push(functionBody);
        } catch (InterpreterException e) {
            throw new InterpreterException(e.getMessage());
        }

        return null;
    }

    @Override
    public MyIDictionary<String, Type> typeCheck(MyIDictionary<String, Type> typeEnv) throws InterpreterException {
        return typeEnv;
    }

    @Override
    public Statement deepCopy() {
        List<Expression> newParams = new Vector<Expression>();
        for (int i = 0; i < parameters.size(); ++i) {
            try {
                newParams.add(parameters.get(i).deepCopy());
            } catch (InterpreterException e) {
                return null;
            }
        }

        return new FunctionCallStatement(functionName, newParams);
    }

    @Override
    public String toString() {
        StringBuilder result = new StringBuilder("call " + functionName + "(");
        for (int i = 0; i < parameters.size() - 1; ++i) {
            try {
                result.append(parameters.get(i).toString()).append(", ");
            } catch (InterpreterException e) {
                return null;
            }
        }

        if (parameters.size() > 0) {
            try {
                result.append(parameters.get(parameters.size() - 1).toString());
                result.append(")");
            } catch (InterpreterException e) {
                return null;
            }
        }

        return result.toString();
    }
}