package Model.Statements;

import Model.Collections.Dictionary.IDictionary;
import Exceptions.ToyLanguageInterpreterException;
import Model.Types.Type;
import Model.ProgramState;
import Model.Values.StringValue;

public interface IStmt {
    IStmt deepCopy();
    ProgramState execute(ProgramState state) throws ToyLanguageInterpreterException;
    IDictionary<String, Type> typeCheck(IDictionary<String, Type> typeTable) throws ToyLanguageInterpreterException;
}
