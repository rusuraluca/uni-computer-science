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
import Model.Values.IValue;
import Model.Values.StringValue;

import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.FileReader;

/**
 * Class that represents the statement that Opens a File for Reading
 */
public class OpenReadFile implements IStatement {
    private final IExpression expression;

    public OpenReadFile(IExpression expression) {
        this.expression = expression;
    }

    @Override
    public ProgramState execute(ProgramState state) throws StatementExecutionException, ExpressionEvaluationException, CollectionsException {
        IValue value = this.expression.eval(state.getSymbolTable(), state.getHeap());

        if (value.getType().equals(new StringType())) {
            StringValue fileName = (StringValue) value;
            IDictionary<String, BufferedReader> fileTable = state.getFileTable();

            if (!fileTable.containsKey(fileName.getValue())) {
                BufferedReader br;
                try {
                    br = new BufferedReader(new FileReader(fileName.getValue()));
                } catch (FileNotFoundException e) {
                    throw new StatementExecutionException(String.format("%s could not be opened", fileName.getValue()));
                }

                fileTable.put(fileName.getValue(), br);
                state.setFileTable(fileTable);
            } else {
                throw new StatementExecutionException(String.format("%s is already opened", fileName.getValue()));
            }
        } else {
            throw new StatementExecutionException(String.format("%s does not evaluate to StringType", expression.toString()));
        }
        return state;
    }

    @Override
    public IDictionary<String, IType> typecheck(IDictionary<String, IType> typeEnv) throws CollectionsException, ExpressionEvaluationException{
        if (!expression.typecheck(typeEnv).equals(new StringType()))
            throw new ExpressionEvaluationException("OpenReadFile requires a string expression");
        return typeEnv;
    }

    @Override
    public String toString() {
        return String.format("openReadFile(%s)", expression.toString());
    }
}