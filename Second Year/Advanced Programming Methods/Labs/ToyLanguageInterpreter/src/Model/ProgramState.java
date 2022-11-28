package Model;

import Model.Collections.Dictionary.IDictionary;
import Model.Collections.List.IList;
import Model.Collections.Stack.IStack;
import Model.Collections.Dictionary.MyDictionary;
import Model.Collections.List.MyList;
import Model.Collections.Stack.MyStack;
import Model.Statements.IStmt;
import Model.Values.StringValue;
import java.io.BufferedReader;
import java.util.ArrayList;
import java.util.List;

import Model.Values.Value;

public class ProgramState {
    IStack<IStmt> executionStack;
    IDictionary<String, Value> symbolTable;
    List<String> outputList;
    IDictionary<String, BufferedReader> fileTable;
    IStmt originalProgram;

    public ProgramState(IStack<IStmt> exeStack, IDictionary<String, Value> symTable, List<String> out, IDictionary<String, BufferedReader> fTable, IStmt oP) {
        executionStack = exeStack;
        symbolTable = symTable;
        outputList = out;
        fileTable = fTable;
        originalProgram = oP.deepCopy();
        executionStack.push(oP);
    }

    public ProgramState(IStmt oP){
        executionStack = new MyStack<>();
        symbolTable = new MyDictionary<>();
        outputList = new ArrayList<>();
        fileTable = new MyDictionary<>();
        originalProgram = oP.deepCopy();
        executionStack.push(oP);
    }

    public IStack<IStmt> getExecutionStack() {
        return executionStack;
    }
    public void setExecutionStack(IStack<IStmt> executionStack) {
        this.executionStack = executionStack;
    }

    public IDictionary<String, Value> getSymbolTable() { return symbolTable; }
    public void setSymbolTable(IDictionary<String, Value> symbolTable) {
        this.symbolTable = symbolTable;
    }
    public List<String> getOutputList() {
        return outputList;
    }
    public void setOutputList(List<String> outputList) {
        this.outputList = outputList;
    }
    public IStmt getOriginalProgram() {
        return originalProgram;
    }
    public void setOriginalProgram(IStmt originalProgram) {
        this.originalProgram = originalProgram;
    }

    public IDictionary<String, BufferedReader> getFileTable() { return fileTable; }
    public void setFileTable(IDictionary<String, BufferedReader> fileTable) { this.fileTable = fileTable; }

    @Override
    public String toString() {
        return  "------------------------------------------------------\n" +
                "Output List\n" +
                outputList.toString()+ "\n" +
                "Symbol Table\n" +
                symbolTable.toString() + "\n" +
                "Execution Stack\n" +
                executionStack.toString() + "\n" +
                "File Table\n" +
                fileTable.toString() + "\n" +
                "------------------------------------------------------";
    }
}