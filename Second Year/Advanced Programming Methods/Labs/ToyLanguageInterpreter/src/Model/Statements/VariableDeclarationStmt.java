package Model.Statements;

import Model.Collections.Dictionary.IDictionary;
import Exceptions.ToyLanguageInterpreterException;
import Exceptions.VariableAlreadyDeclaredException;
import Model.Types.Type;
import Model.Values.Value;
import Model.ProgramState;

public class VariableDeclarationStmt implements IStmt {
    String name;
    Type type;

    public VariableDeclarationStmt(String name, Type type) { this.name = name; this.type = type; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Type getType() { return type; }
    public void setType(Type type) { this.type = type; }

    @Override
    public IStmt deepCopy(){
        return new VariableDeclarationStmt(name, type);
    }

    @Override
    public IDictionary<String, Type> typeCheck(IDictionary<String, Type> typeTable) {
        typeTable.put(name, type);
        return typeTable;
    }

    @Override
    public ProgramState execute(ProgramState state) throws ToyLanguageInterpreterException {
        IDictionary<String, Value> symTable = state.getSymbolTable();
        if (symTable.containsKey(name))
            throw new VariableAlreadyDeclaredException(String.format("%s already exists in the Symbol Table!", name));
        symTable.put(name, type.getDefault());

        return state;
    }

    @Override
    public String toString(){ return name.toString() + " " + type.toString(); }
}
