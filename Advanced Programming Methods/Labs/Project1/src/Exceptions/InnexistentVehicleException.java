package Exceptions;

public class InnexistentVehicleException extends Exception{
    public InnexistentVehicleException(){
        super("Vehicle NOT found in the parking lot!");
    }

    public InnexistentVehicleException(String msg){
        super(msg);
    }
}
