package Controller;

import Model.Collections.Stack.IStack;
import Exceptions.ToyLanguageInterpreterException;
import Exceptions.ADTEmptyException;
import Exceptions.InterruptedException;
import Model.Statements.IStmt;
import Repository.IRepository;
import Model.ProgramState;

import java.io.IOException;

public class Controller {
    // maintain a reference to the repository
    // reference type is an interface such that we can easily modify the repository implementation
    private IRepository repository;

    public Controller(IRepository repository) { this.repository = repository; }

    // take one of the Program States from repository
    // analyse the top of the Execution Stack of that Program State
    // based on the content of the ExeStack top execute one of the Statement Execution rules
    private ProgramState oneStepExecutionOfProgram(ProgramState state) throws ToyLanguageInterpreterException {

        IStack<IStmt> executionStack = state.getExecutionStack();

        // trying to execute when the Execution Stack is empty
        if (executionStack.isEmpty())
            throw new ADTEmptyException("Program State Execution Stack is empty!");

        IStmt currentStmt = executionStack.pop();

        try{
            // Statement Classes execute methods and oneStepExecutionOfProgram method return a Program State
            return currentStmt.execute(state);
        } catch (ToyLanguageInterpreterException e){
            throw new InterruptedException("One Step Execution of Program Interrupted!");
        }
    }

     public void completeExecutionOfProgram() throws IOException, ToyLanguageInterpreterException {
        ProgramState programState = this.repository.getCurrentProgram();

        while (!programState.getExecutionStack().isEmpty()){
            try {
                oneStepExecutionOfProgram(programState);
                this.repository.logProgramStateExecution(programState);
            } catch (IOException e) {
                throw new IOException("Printing Execution of Program Interrupted!");
            }
        }
    }
}

