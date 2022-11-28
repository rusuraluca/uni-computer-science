package Model.Statements;

import Model.Collections.Dictionary.IDictionary;
import Model.Types.Type;
import Model.ProgramState;

public class NopStmt implements IStmt {
    @Override
    public IStmt deepCopy(){
        return new NopStmt();
    }

    @Override
    public IDictionary<String, Type> typeCheck(IDictionary<String, Type> typeTable) {
        return typeTable;
    }
    @Override
    public ProgramState execute(ProgramState state) {
        return state;
    }

    @Override
    public String toString(){ return "nop"; }
}

