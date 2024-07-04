package domain;

import java.util.Objects;

public class Tema implements HasID<String> {
    private String idTema;
    private String descriere;
    private int deadline;
    private int startline;

    public Tema(String idTema, String descriere, int deadline, int startline) {
        this.idTema = idTema;
        this.descriere = descriere;
        this.deadline = deadline;
        this.startline = startline;
    }

    @Override
    public String getID() { return idTema; }

    @Override
    public void setID(String idTema) { this.idTema = idTema; }

    public String getDescriere() { return descriere; }

    public void setDescriere(String descriere) { this.descriere = descriere; }

    public int getDeadline() { return deadline; }

    public void setDeadline(int deadline) { this.deadline = deadline; }

    public int getStartline() { return startline; }

    public void setStartline(int startline) { this.startline = startline; }

    @Override
    public String toString() {
        return "Tema{" + "id='" + idTema + "', descriere='" + descriere + ", deadline=" + deadline +
                ", startline=" + startline + '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Tema tema = (Tema) o;
        return Objects.equals(idTema, tema.idTema);
    }

    @Override
    public int hashCode() { return Objects.hash(idTema); }
}
