package repository;

import domain.HasID;
import validation.ValidationException;
import validation.Validator;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.transform.*;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;
import java.io.IOException;

public abstract class AbstractXMLRepository<ID, E extends HasID<ID>> extends AbstractCRUDRepository<ID, E> {
    protected String XMLfilename;

    public AbstractXMLRepository(Validator<E> validator, String XMLfilename) {
        super(validator);
        this.XMLfilename = XMLfilename;
    }

    protected abstract E getEntityFromNode(Element node);
    protected abstract Element getElementFromEntity(E entity, Document XMLdocument);

    protected void loadFromXmlFile() {
        try {
            Document XMLdocument = DocumentBuilderFactory.newInstance().newDocumentBuilder().parse(XMLfilename);
            Element root = XMLdocument.getDocumentElement();
            NodeList list = root.getChildNodes();

            for(int i = 0; i < list.getLength(); i++) {
                Node node = list.item(i);
                if (node.getNodeType() == Element.ELEMENT_NODE) {
                    try {
                        super.save(getEntityFromNode((Element)node));
                    }
                    catch(ValidationException ve) {
                        ve.printStackTrace();
                    }
                }
            }
        }
        catch(ParserConfigurationException pce) {
            pce.printStackTrace();
        }
        catch(SAXException s) {
            s.printStackTrace();
        }
        catch(IOException i) {
            i.printStackTrace();
        }
    }

    protected void writeToXmlFile() {
        try {
            Document XMLdocument = DocumentBuilderFactory.newInstance().newDocumentBuilder().newDocument();
            Element root = XMLdocument.createElement("Entitati");
            XMLdocument.appendChild(root);

            entities.values().forEach(entity -> root.appendChild(getElementFromEntity(entity, XMLdocument)));
            Transformer XMLtransformer = TransformerFactory.newInstance().newTransformer();
            XMLtransformer.setOutputProperty(OutputKeys.INDENT, "yes");
            XMLtransformer.transform(new DOMSource(XMLdocument), new StreamResult(XMLfilename));
        }
        catch(ParserConfigurationException pce) {
            pce.printStackTrace();
        }
        catch(TransformerConfigurationException tce) {
            tce.printStackTrace();
        }
        catch(TransformerException te) {
            te.printStackTrace();
        }
    }

    protected Element createElement(Document XMLdocument, String tag, String value) {
        Element element = XMLdocument.createElement(tag);
        element.setTextContent(value);
        return element;
    }

    @Override
    public E save(E entity) throws ValidationException {
        E result = super.save(entity);
        if (result == null) {
            writeToXmlFile();
        }
        return result;
    }

    @Override
    public E delete(ID id) {
        E result = super.delete(id);
        writeToXmlFile();

        return result;
    }

    @Override
    public E update(E newEntity) {
        E result = super.update(newEntity);
        writeToXmlFile();

        return result;
    }
}
