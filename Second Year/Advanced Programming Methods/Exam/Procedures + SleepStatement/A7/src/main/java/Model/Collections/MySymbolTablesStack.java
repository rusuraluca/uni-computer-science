package Model.Collections;

import Exceptions.InterpreterException;
import Model.Value.Value;

public class MySymbolTablesStack extends MyStack<MyIDictionary<String, Value>> {
    public MySymbolTablesStack deepCopy() throws InterpreterException {
        MySymbolTablesStack newStack = new MySymbolTablesStack();
        MyStack<MyIDictionary<String, Value>> tempStack = new MyStack<>();

        while (!this.stack.empty())
            tempStack.push(this.stack.pop());

        while (!tempStack.isEmpty()) {
            stack.push(tempStack.peek());
            try {
                newStack.push(tempStack.pop().deepCopy());
            } catch (InterpreterException e) {
                throw new InterpreterException(e.getMessage());
            }
        }

        return newStack;
    }

}
