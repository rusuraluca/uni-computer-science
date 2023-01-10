package Model.Statements.File;

import Exceptions.ExpressionEvaluationException;
import Exceptions.StatementExecutionException;
import Exceptions.CollectionsException;
import Model.Expressions.IExpression;
import Model.ProgramState.ProgramState;
import Model.Statements.IStatement;
import Model.Types.IType;
import Model.Types.IntType;
import Model.Types.StringType;
import Model.Collections.IDictionary;
import Model.Values.IntValue;
import Model.Values.IValue;
import Model.Values.StringValue;

import java.io.BufferedReader;
import java.io.IOException;

/**
 * Class that represents the statement that Reads a File
 */
public class ReadFile implements IStatement {
    private final IExpression expression;
    private final String varName;

    public ReadFile(IExpression expression, String varName) {
        this.expression = expression;
        this.varName = varName;
    }

    @Override
    public IDictionary<String, IType> typecheck(IDictionary<String, IType> typeEnv) throws CollectionsException, ExpressionEvaluationException{
        if (!expression.typecheck(typeEnv).equals(new StringType()))
            throw new ExpressionEvaluationException("ReadFile requires a string as expression parameter");
        if (!typeEnv.get(varName).equals(new IntType()))
            throw new ExpressionEvaluationException("ReadFile requires an int as variable parameter");
        return typeEnv;
    }

    @Override
    public ProgramState execute(ProgramState state) throws StatementExecutionException, ExpressionEvaluationException, CollectionsException {
        IDictionary<String, IValue> symbolTable = state.getSymbolTable();
        IDictionary<String, BufferedReader> fileTable = state.getFileTable();

        if (symbolTable.containsKey(varName)) {
            IValue value = symbolTable.lookUp(varName);

            if (value.getType().equals(new IntType())) {
                value = expression.eval(symbolTable, state.getHeap());

                if (value.getType().equals(new StringType())) {
                    StringValue castValue = (StringValue) value;

                    if (fileTable.containsKey(castValue.getValue())) {
                        BufferedReader br = fileTable.lookUp(castValue.getValue());

                        try {
                            String line = br.readLine();
                            if (line == null)
                                line = "0";
                            symbolTable.put(varName, new IntValue(Integer.parseInt(line)));
                        } catch (IOException e) {
                            throw new StatementExecutionException(String.format("Could not read from file %s", castValue));
                        }
                    } else {
                        throw new StatementExecutionException(String.format("The file table does not contain %s", castValue));
                    }
                } else {
                    throw new StatementExecutionException(String.format("%s does not evaluate to StringType", value));
                }
            } else {
                throw new StatementExecutionException(String.format("%s is not of type IntType", value));
            }
        } else {
            throw new StatementExecutionException(String.format("%s is not present in the SymbolTable.", varName));
        }
        return state;
    }

    @Override
    public String toString() {
        return String.format("readFile(%s, %s)", expression.toString(), varName);
    }
}