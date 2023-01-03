package Controller;

import Exceptions.CollectionsException;
import Exceptions.ExpressionEvaluationException;
import Exceptions.StatementExecutionException;
import Model.ProgramState.ProgramState;
import Model.Values.IValue;
import Model.Values.ReferenceValue;
import Repository.IRepository;
import java.io.IOException;
import java.util.*;
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.stream.Collectors;
import java.util.stream.Stream;

/**
 * Class for the controller of the program
 */
public class Controller {
    IRepository repo;
    ExecutorService executorService; // for the parallel execution
    public Controller(IRepository repo) {
        this.repo = repo;
    }

    /**
     * Before the execution, print the PrgState List into the log file:
     *  -> get the list of callables (each callable is a program state); map each program state to a callable; collect the list of callables
     *  -> run concurrently the callables; get the list of new created program states; get the program state
     *  -> remove the null program states; collect the list of new program states
     *  -> add the new program states to the list of existing program states
     **/
    public void oneStepForAllPrograms(List<ProgramState> programStates) throws InterruptedException {
        programStates.forEach(programState -> {
            try {
                repo.logProgramStateExecution(programState);
            } catch (IOException | CollectionsException e) {
                System.out.println(e.getMessage());
            }
        });

        List<Callable<ProgramState>> callList = programStates.stream()
                .map((ProgramState p) -> (Callable<ProgramState>) (p::oneStep))
                .collect(Collectors.toList());

        List<ProgramState> newProgramList = executorService.invokeAll(callList).stream()
                .map(future -> {
                    try {
                        return future.get();
                    } catch (ExecutionException | InterruptedException e) {
                        System.out.println(e.getMessage());
                    }
                    return null;
                })
                .filter(Objects::nonNull)
                .toList();
        programStates.addAll(newProgramList);

        programStates.forEach(programState -> {
            try {
                repo.logProgramStateExecution(programState);
            } catch (IOException | CollectionsException e) {
                System.out.println(e.getMessage());
            }
        });

        repo.setProgramStates(programStates);
    }

    public List<Integer> getAddressFromSymbolTable(Collection<IValue> symbolTableValues) {
        return symbolTableValues.stream().filter(v -> v instanceof ReferenceValue).map(v -> {
            ReferenceValue v1 = (ReferenceValue) v;
            return v1.getAddress();
        }).collect(Collectors.toList());
    }

    public List<Integer> getAddressFromHeap(Collection<IValue> heapValues) {
        return heapValues.stream()
                .filter(v -> v instanceof ReferenceValue)
                .map(v -> {
                    ReferenceValue v1 = (ReferenceValue) v;
                    return v1.getAddress();
                })
                .collect(Collectors.toList());
    }

    /**
     * Removes the completed programs from the list of programs
     **/
    public List<ProgramState> removeCompletedPrograms(List<ProgramState> inProgramList) {
        return inProgramList.stream().filter(p -> !p.isNotCompleted()).collect(Collectors.toList());
    }

    public Map<Integer, IValue> safeGarbageCollector(List<Integer> symbolTableAddress, List<Integer> heapAddress, Map<Integer, IValue> heap) {
        return heap.entrySet().stream()
                .filter(e -> (symbolTableAddress.contains(e.getKey()) || heapAddress.contains(e.getKey())))
                .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
    }

    /**
     * Removes the unused values from the heap:
     *  -> get the list of symbol table addresses; get the list of addresses from the symbol table values
     *  -> map each list of addresses to a stream; concatenate the streams; collect the list of addresses
     *  -> get the list of heap addresses; update the heap
     **/
    public void conservativeGarbageCollector(List<ProgramState> programStates) {
        List<Integer> symbolTableAddresses = Objects.requireNonNull(programStates.stream()
                        .map(p -> getAddressFromSymbolTable(p.getSymbolTable().values()))
                        .map(Collection::stream)
                        .reduce(Stream::concat).orElse(null))
                .collect(Collectors.toList());
        programStates.forEach(p -> p.getHeap().setContent((HashMap<Integer, IValue>) safeGarbageCollector(symbolTableAddresses, getAddressFromHeap(p.getHeap().getContent().values()), p.getHeap().getContent())));
    }

    /**
     * Executes all the steps and displays the current state of the program:
     *  -> create a new executor service with 2 threads; get the list of program states from the repository
     *  -> while there are program states in the list; execute one step for all the program states
     *  -> get the list of program states from the repository; shutdown the executor service
     */
    public void allSteps() throws CollectionsException, StatementExecutionException, ExpressionEvaluationException, IOException, InterruptedException {
        executorService = Executors.newFixedThreadPool(2);
        List<ProgramState> programStateList = removeCompletedPrograms(repo.getProgramList());

        while (programStateList.size() > 0) {
            conservativeGarbageCollector(programStateList);
            oneStepForAllPrograms(programStateList);
            programStateList = removeCompletedPrograms(repo.getProgramList());
        }

        executorService.shutdownNow();
        repo.setProgramStates(programStateList);
    }
}

