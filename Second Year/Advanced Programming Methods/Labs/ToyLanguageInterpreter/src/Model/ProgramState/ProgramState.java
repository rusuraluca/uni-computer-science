package Model.ProgramState;

import Exceptions.ExpressionEvaluationException;
import Exceptions.StatementExecutionException;
import Exceptions.CollectionsException;
import Model.Collections.*;

import Model.Values.IValue;
import Model.Statements.IStatement;

import java.io.BufferedReader;
import java.util.List;

/**
 * Class that represents the state of the program at a given moment
 **/
public class ProgramState {
    IStack<IStatement> executionStack;
    IDictionary<String, IValue> symbolTable;
    IList<IValue> outputList;
    IDictionary<String, BufferedReader> fileTable;
    IStatement originalProgram;
    IHeap heap;
    int id; // id of the program state
    public static int lastId = 0; // last id given to a program state

    public ProgramState(IStack<IStatement> executionStack, IDictionary<String, IValue> symbolTable, IList<IValue> outputList, IDictionary<String, BufferedReader> fileTable, IHeap heap, IStatement originalProgram) {
        this.executionStack = executionStack;
        this.symbolTable = symbolTable;
        this.outputList = outputList;
        this.fileTable = fileTable;
        this.heap = heap;
        this.originalProgram = originalProgram;
        this.executionStack.push(this.originalProgram);
        this.id = setId(); // set the id of the program state
    }

    public ProgramState(IStack<IStatement> executionStack, IDictionary<String, IValue> symbolTable, IList<IValue> outputList, IDictionary<String, BufferedReader> fileTable, IHeap heap) {
        this.executionStack = executionStack;
        this.symbolTable = symbolTable;
        this.outputList = outputList;
        this.fileTable = fileTable;
        this.heap = heap;
        this.id = setId();
    }

    public synchronized int setId() {
        // set the id of the program state
        lastId++;
        return lastId;
    }

    public int getId() {
        return lastId;
    }

    public boolean isNotCompleted() {
        // check if the program state is completed
        return executionStack.isEmpty();
    }

    public IStack<IStatement> getExecutionStack() {
        return executionStack;
    }
    public void setExecutionStack(IStack<IStatement> executionStack) {
        this.executionStack = executionStack;
    }

    public IDictionary<String, IValue> getSymbolTable() {
        return symbolTable;
    }
    public void setSymbolTable(IDictionary<String, IValue> symbolTable) {
        this.symbolTable = symbolTable;
    }

    public IList<IValue> getOutputList() {
        return outputList;
    }
    public void setOutputList(IList<IValue> outputList) {
        this.outputList = outputList;
    }

    public IDictionary<String, BufferedReader> getFileTable() {
        return fileTable;
    }
    public void setFileTable(IDictionary<String, BufferedReader> fileTable) {
        this.fileTable = fileTable;
    }

    public IHeap getHeap() {
        return heap;
    }
    public void setHeap(IHeap heap) {
        this.heap = heap;
    }

    public ProgramState oneStep() throws StatementExecutionException, ExpressionEvaluationException, CollectionsException {
        if (!executionStack.isEmpty()) {
            IStatement currentStatement = executionStack.pop();
            return currentStatement.execute(this);
        }
        return null;
    }

    public String executionStackToString() {
        StringBuilder executionStackStringBuilder = new StringBuilder();
        List<IStatement> stack = executionStack.getReversed();

        for (IStatement statement : stack)
            executionStackStringBuilder.append(statement.toString()).append("\n");

        return executionStackStringBuilder.toString();
    }

    public String symbolTableToString() throws CollectionsException {
        StringBuilder symbolTableStringBuilder = new StringBuilder();

        for (String key : symbolTable.keySet())
            symbolTableStringBuilder.append(String.format("%s -> %s\n", key, symbolTable.lookUp(key).toString()));

        return symbolTableStringBuilder.toString();
    }

    public String outputListToString() {
        StringBuilder outStringBuilder = new StringBuilder();

        for (IValue elem : outputList.getList())
            outStringBuilder.append(String.format("%s\n", elem.toString()));

        return outStringBuilder.toString();
    }

    public String fileTableToString() {
        StringBuilder fileTableStringBuilder = new StringBuilder();

        for (String key : fileTable.keySet())
            fileTableStringBuilder.append(String.format("%s\n", key));

        return fileTableStringBuilder.toString();
    }

    public String heapToString() throws CollectionsException {
        StringBuilder heapStringBuilder = new StringBuilder();
        for (int key : heap.keySet())
            heapStringBuilder.append(String.format("%d -> %s\n", key, heap.get(key)));

        return heapStringBuilder.toString();
    }

    @Override
    public String toString() {
        return "ID: \n" + id + "\nExecution stack: \n" + executionStack.getReversed() + "\nSymbol table: \n" + symbolTable.toString() + "\nOutput list: \n" + outputList.toString() + "\nFile table:\n" + fileTable.toString() + "\nHeap memory:\n" + heap.toString() + "\n";
    }

    public String programStateToString() throws CollectionsException {
        return  "------------------------------------------------------\n" +
                "Id:\n" +
                id + "\n" +
                "Execution Stack:\n" +
                executionStackToString() + "\n" +
                "Symbol Table:\n" +
                symbolTableToString() + "\n" +
                "Output List:\n" +
                outputListToString() + "\n" +
                "File Table:\n" +
                fileTableToString() + "\n" +
                "Heap:\n" +
                heapToString() + "\n\n";
    }
}