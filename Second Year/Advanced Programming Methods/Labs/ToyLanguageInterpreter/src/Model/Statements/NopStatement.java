package Model.Statements;

import Exceptions.CollectionsException;
import Exceptions.ExpressionEvaluationException;
import Exceptions.StatementExecutionException;
import Model.Collections.IDictionary;
import Model.ProgramState.ProgramState;
import Model.Types.IType;

/**
 * Class that represents the Nop statement
 */
public class NopStatement implements IStatement {
    @Override
    public ProgramState execute(ProgramState state) {
        return null;
    }
    @Override
    public IDictionary<String, IType> typecheck(IDictionary<String, IType> typeEnv) throws CollectionsException, ExpressionEvaluationException, StatementExecutionException {
        return typeEnv;
    }
    @Override
    public String toString() {
        return "NopStatement";
    }
}
