package View;
import Model.Vehicle;
import Controller.Controller;

public class UI {
    Controller c;

    public UI(Controller c) {
        this.c = c;
    }
    public void show(){
        Vehicle[] sol = c.solve();
        System.out.println("The red vehicles in the parking are:");
        for (Vehicle v : sol) {
            System.out.println(v.toString());
        }
    }

    public void menu(){

    }
}