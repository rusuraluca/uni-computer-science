package console;

import domain.*;
import service.Service;

import java.util.Scanner;

public class UI {
    private Service service;

    public UI(Service service) {
        this.service = service;
    }

    public void printMenu() {
        System.out.println("11. Afiseaza toti studentii.");
        System.out.println("12. Afiseaza toate temele.");
        System.out.println("13. Afiseaza toate notele.");

        System.out.println("21. Adauga un nou student.");
        System.out.println("22. Adauga o tema noua.");
        System.out.println("23. Adauga o nota unui student pentru o tema.");

        System.out.println("31. Sterge un student existent.");
        System.out.println("32. Sterge o tema existenta.");

        System.out.println("4. Actualizeaza datele unui student.");

        System.out.println("5. Prelungeste deadline-ul unei teme.");

        System.out.println("0. EXIT \n");
    }

    public void uiPrintAllStudents() {
        for(Student student : service.findAllStudents()) {
            System.out.println(student);
        }
    }

    public void uiPrintAllTeme() {
        for(Tema tema : service.findAllTeme()) {
            System.out.println(tema);
        }
    }

    public void uiPrintAllNote() {
        for(Nota note : service.findAllNote()) {
            System.out.println(note);
        }
    }

    public void uiSaveStudent() {
        Scanner scanner = new Scanner(System.in);

        System.out.println("Introduceti ID-ul studentului: ");
        String id = scanner.nextLine();

        System.out.println("Introduceti numele studentului: ");
        String nume = scanner.nextLine();

        System.out.println("Introduceti grupa studentului: ");
        int grupa = scanner.nextInt();

        if (service.saveStudent(id, nume, grupa) != 0) {
            System.out.println("Student adaugat cu succes! \n");
        }
        else {
            System.out.println("Student existent sau invalid! \n");
        }
    }

    public void uiSaveTema() {
        Scanner scanner = new Scanner(System.in);

        System.out.println("Introduceti ID-ul temei: ");
        String id = scanner.nextLine();

        System.out.println("Introduceti o descriere a temei: ");
        String descriere = scanner.nextLine();

        System.out.println("Introduceti saptamana deadline a temei: ");
        int deadline = scanner.nextInt();

        System.out.println("Introduceti saptamana startline a temei: ");
        int startline = scanner.nextInt();

        if (service.saveTema(id, descriere, deadline, startline) != 0) {
            System.out.println("Tema adaugata cu succes! \n");
        }
        else {
            System.out.println("Tema existenta sau invalida! \n");
        }
    }

    public void uiSaveNota() {
        Scanner scanner = new Scanner(System.in);

        System.out.println("Introduceti ID-ul studentului: ");
        String idStudent = scanner.nextLine();

        System.out.println("Introduceti ID-ul temei: ");
        String idTema = scanner.nextLine();

        System.out.println("Introduceti valoarea notei: ");
        String linie = scanner.nextLine();
        double valNota = Double.parseDouble(linie);

        System.out.println("Introduceti saptamana de predare a temei: ");
        String linie2 = scanner.nextLine();
        int predata = Integer.parseInt(linie2);

        System.out.println("Dati un feedback temei: ");
        String feedback = scanner.nextLine();

        int result = service.saveNota(idStudent, idTema, valNota, predata, feedback);
        if (result == 1) {
            service.createStudentFile(idStudent, idTema);
            System.out.println("Nota adaugata cu succes! \n");
        }
        else if (result == 0) {
            System.out.println("Nota existenta! \n");
        }
        else {
            System.out.println("Student sau tema inexistenta! \n");
        }
    }

    public void uiDeleteStudent() {
        Scanner scanner = new Scanner(System.in);

        System.out.println("Introduceti ID-ul studentului: ");
        String id = scanner.nextLine();

        if (service.deleteStudent(id) != 0) {
            System.out.println("Student sters cu succes! \n");
        }
        else {
            System.out.println("Studentul nu exista! \n");
        }
    }

    public void uiDeleteTema() {
        Scanner scanner = new Scanner(System.in);

        System.out.println("Introduceti ID-ul temei: ");
        String id = scanner.nextLine();

        if (service.deleteTema(id) != 0) {
            System.out.println("Tema stearsa cu succes! \n");
        }
        else {
            System.out.println("Tema nu exista! \n");
        }
    }

    public void uiUpdateStudent() {
        Scanner scanner = new Scanner(System.in);

        System.out.println("Introduceti ID-ul studentului: ");
        String id = scanner.nextLine();

        System.out.println("Introduceti noul nume al studentului: ");
        String numeNou = scanner.nextLine();

        System.out.println("Introduceti noua grupa a studentului: ");
        int grupaNoua = scanner.nextInt();

        if (service.updateStudent(id, numeNou, grupaNoua) != 0) {
            System.out.println("Student actualizat cu succes! \n");
        }
        else {
            System.out.println("Studentul nu exista! \n");
        }
    }

    public void uiExtendDeadline() {
        Scanner scanner = new Scanner(System.in);

        System.out.println("Introduceti ID-ul temei: ");
        String id = scanner.nextLine();

        System.out.println("Introduceti numarul de saptamani adaugate la deadline: ");
        int nrWeeks = scanner.nextInt();

        if (service.extendDeadline(id, nrWeeks) != 0) {
            System.out.println("Deadline extins cu succes! \n");
        }
        else {
            System.out.println("Tema nu exista! \n");
        }
    }

    public void run() {
        Scanner scanner = new Scanner(System.in);
        int cmd = -1;

        printMenu();

        while(cmd != 0) {
            System.out.println("Introduceti comanda: ");
            cmd = scanner.nextInt();

            switch(cmd) {
                case 11:
                    uiPrintAllStudents();
                    break;
                case 12:
                    uiPrintAllTeme();
                    break;
                case 13:
                    uiPrintAllNote();
                    break;
                case 21:
                    uiSaveStudent();
                    break;
                case 22:
                    uiSaveTema();
                    break;
                case 23:
                    uiSaveNota();
                    break;
                case 31:
                    uiDeleteStudent();
                    break;
                case 32:
                    uiDeleteTema();
                    break;
                case 4:
                    uiUpdateStudent();
                    break;
                case 5:
                    uiExtendDeadline();
                    break;
                case 0:
                    cmd = 0;
                    break;
            }
        }
    }
}
