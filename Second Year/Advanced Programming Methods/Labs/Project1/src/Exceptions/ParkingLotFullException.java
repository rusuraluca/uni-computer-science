package Exceptions;

public class ParkingLotFullException extends Exception{
    public ParkingLotFullException(){
        super("NO more available parking lots!");
    }

    public ParkingLotFullException(String msg) { super(msg); }
}
