package Model.Statements;

import Exceptions.CollectionsException;
import Exceptions.ExpressionEvaluationException;
import Exceptions.StatementExecutionException;

import Model.Collections.IDictionary;
import Model.ProgramState.ProgramState;
import Model.Types.IType;
import Model.Types.IntType;

/**
 * Interface for all Statements
 */
public interface IStatement {
    ProgramState execute(ProgramState state) throws CollectionsException, ExpressionEvaluationException, StatementExecutionException;
    IDictionary<String, IType> typecheck(IDictionary<String, IType> typeEnv) throws CollectionsException, ExpressionEvaluationException, StatementExecutionException;
}
