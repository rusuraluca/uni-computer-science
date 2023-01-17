package View.gui;

import java.io.BufferedReader;
import java.net.URL;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.ResourceBundle;
import java.util.concurrent.atomic.AtomicInteger;

import Controller.Controller;
import Model.ProgramState.ProgramState;
import Model.Statements.IStatement;
import Model.Values.IValue;
import javafx.beans.property.ReadOnlyStringWrapper;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.event.ActionEvent;
import javafx.event.EventHandler;
import javafx.fxml.FXML;
import javafx.fxml.Initializable;
import javafx.scene.control.Alert;
import javafx.scene.control.Alert.AlertType;
import javafx.scene.control.Button;
import javafx.scene.control.ButtonType;
import javafx.scene.control.Label;
import javafx.scene.control.ListView;
import javafx.scene.control.TableColumn;
import javafx.scene.control.TableView;
import javafx.scene.input.MouseEvent;
import javafx.stage.Stage;

public class programRunController implements Initializable {

    Controller myController;
    @FXML
    Label nrPrgStates;
    @FXML
    Button runButton;
    @FXML
    TableView<HashMap.Entry<Integer, IValue>> heapTable;
    @FXML
    TableColumn<HashMap.Entry<Integer,IValue>, String> heapTableAddress;
    @FXML
    TableColumn<HashMap.Entry<Integer,IValue>, String> heapTableValue;
    @FXML
    ListView<String> outList;
    @FXML
    TableView<HashMap.Entry<String, BufferedReader>> fileTable;
    @FXML
    TableColumn<HashMap.Entry<String, BufferedReader>, String> fileTableIdentifier;
    @FXML
    TableColumn<HashMap.Entry<String, BufferedReader>, String> fileTableFileName;
    @FXML
    ListView<String> prgStateList;
    @FXML
    TableView<HashMap.Entry<String, IValue>> symTable;
    @FXML
    TableColumn<HashMap.Entry<String, IValue>, String> symTableVariable;
    @FXML
    TableColumn<HashMap.Entry<String, IValue>, String> symTableValue;
    @FXML
    ListView<String> exeStackList;

    public programRunController(Controller myController) {
        this.myController = myController;
    }

    @Override
    public void initialize(URL location, ResourceBundle resources) {
        ProgramState.lastId = 1;
        initialRun();
        prgStateList.setOnMouseClicked(new EventHandler<MouseEvent>() {
            @Override
            public void handle(MouseEvent event) {
                setSymTableAndExeStack();
            }
        });
        runButton.setOnAction(new EventHandler<ActionEvent>() {
            @Override
            public void handle (ActionEvent e) {
                try {
                    myController.allocateExecutor();
                    List<ProgramState> prgList = myController.removeCompletedPrograms(myController.getStateRepo().getProgramList());
                    if (prgList.size() > 0) {
                        List<Integer> allTables = new ArrayList<Integer>();
                        for (ProgramState ps : prgList) {
                            allTables.addAll(myController.getGarbageCollector().getAddrFromSymTable(ps.getSymbolTable().getContent().values()));
                        }
                        myController.getGarbageCollector().conservativeGarbageCollector(allTables, prgList.get(0).getHeap().getContent());
                        myController.oneStepForAllPrograms(prgList);
                    }
                    else
                        throw new InterruptedException("Program is already completed!");
                } catch (InterruptedException e1) {
                    Alert alert = new Alert(AlertType.INFORMATION);
                    alert.setTitle("Toy Language - Current program finished");
                    alert.setHeaderText(null);
                    alert.setContentText("Program successfully finished!");
                    Button confirm = (Button) alert.getDialogPane().lookupButton( ButtonType.OK );
                    confirm.setDefaultButton(false);
                    confirm.setStyle("-fx-focus-color: transparent; -fx-faint-focus-color: transparent;");
                    alert.showAndWait();
                    Stage stage = (Stage) heapTable.getScene().getWindow();
                    stage.close();
                }

                updateUIComponents();
                myController.deallocateExecutor();
            }
        });
    }

    public void initialRun() {
        setNumberLabel();
        setHeapTable();
        setOutList();
        setFileTable();
        setPrgStateList();
        prgStateList.getSelectionModel().selectFirst();
        setSymTableAndExeStack();
    }

    public void updateUIComponents() {
        setNumberLabel();
        setHeapTable();
        setOutList();
        setFileTable();
        setPrgStateList();
        if(prgStateList.getSelectionModel().getSelectedItem() == null) {
            prgStateList.getSelectionModel().selectFirst();
        }
        setSymTableAndExeStack();
    }

    public void setNumberLabel() {
        nrPrgStates.setText("The number of Program States: " + myController.getStateRepo().getProgramList().size());
    }

    public void setHeapTable() {
        ObservableList<HashMap.Entry<Integer, IValue>> heapTableList = FXCollections.observableArrayList();
        heapTableAddress.setCellValueFactory(cellData -> new ReadOnlyStringWrapper(Integer.toString(cellData.getValue().getKey())));
        heapTableValue.setCellValueFactory(cellData -> new ReadOnlyStringWrapper(cellData.getValue().getValue().toString()));
        heapTableList.addAll(myController.getStateRepo().getProgramList().get(0).getHeap().getContent().entrySet());
        heapTable.setItems(heapTableList);
        heapTable.refresh();
    }

    public void setOutList() {
        ObservableList<String> outObservableList = FXCollections.observableArrayList();
        for(IValue e : myController.getStateRepo().getProgramList().get(0).getOutputList().getList()) {
            outObservableList.add(e.toString());
        }
        outList.setItems(outObservableList);
    }

    public void setFileTable() {
        ObservableList<HashMap.Entry<String, BufferedReader>> fileTableList = FXCollections.observableArrayList();
        fileTableIdentifier.setCellValueFactory(cellData -> new ReadOnlyStringWrapper(cellData.getValue().getKey()));
        fileTableFileName.setCellValueFactory(cellData -> new ReadOnlyStringWrapper(cellData.getValue().getValue().toString()));
        fileTableList.addAll(myController.getStateRepo().getProgramList().get(0).getFileTable().getContent().entrySet());
        fileTable.setItems(fileTableList);
        fileTable.refresh();
    }

    public void setPrgStateList() {
        ObservableList<String> prgStateIdList = FXCollections.observableArrayList();
        for(ProgramState e : myController.getStateRepo().getProgramList().stream().toList()) {
            prgStateIdList.add(e.getId());
        }
        prgStateList.setItems(prgStateIdList);
    }

    public void setSymTableAndExeStack() {
        ObservableList<HashMap.Entry<String, IValue>> symTableList = FXCollections.observableArrayList();
        ObservableList<String> exeStackItemsList = FXCollections.observableArrayList();
        symTableVariable.setCellValueFactory(cellData -> new ReadOnlyStringWrapper(cellData.getValue().getKey()));
        symTableValue.setCellValueFactory(cellData -> new ReadOnlyStringWrapper(cellData.getValue().getValue().toString()));
        List<ProgramState> allPrgs = myController.getStateRepo().getProgramList();
        ProgramState prgResult = null;
        for(ProgramState e : allPrgs) {
            if(e.getId() == Integer.parseInt(prgStateList.getSelectionModel().getSelectedItem())) {
                prgResult = e;
                break;
            }
        }
        if(prgResult != null) {
            symTableList.addAll(prgResult.getSymbolTable().getContent().entrySet());
            for(IStatement e : prgResult.getExecutionStack().getReversed()) {
                exeStackItemsList.add(e.toString());
            }
            symTable.setItems(symTableList);
            exeStackList.setItems(exeStackItemsList);
            symTable.refresh();
        }
    }

}
