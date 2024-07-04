package repository;

import domain.Tema;
import validation.Validator;
import org.w3c.dom.Document;
import org.w3c.dom.Element;

public class TemaXMLRepository extends AbstractXMLRepository<String, Tema> {

    public TemaXMLRepository(Validator<Tema> validator, String XMLfilename) {
        super(validator, XMLfilename);
        loadFromXmlFile();
    }

    protected Element getElementFromEntity(Tema tema, Document XMLdocument) {
        Element element = XMLdocument.createElement("tema");
        element.setAttribute("ID", tema.getID());

        element.appendChild(createElement(XMLdocument, "Descriere", tema.getDescriere()));
        element.appendChild(createElement(XMLdocument, "Deadline", String.valueOf(tema.getDeadline())));
        element.appendChild(createElement(XMLdocument, "Startline", String.valueOf(tema.getStartline())));

        return element;
    }

    protected Tema getEntityFromNode(Element node) {
        String ID = node.getAttributeNode("ID").getValue();
        String descriere = node.getElementsByTagName("Descriere").item(0).getTextContent();
        int deadline = Integer.parseInt(node.getElementsByTagName("Deadline").item(0).getTextContent());
        int startline = Integer.parseInt(node.getElementsByTagName("Startline").item(0).getTextContent());

        return new Tema(ID, descriere, deadline, startline);
    }
}
