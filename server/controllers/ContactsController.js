const Contact = require('../models/Contact');

const getAllContacts = async (req, res) => {
    const contacts = await Contact.find();
    if (!contacts) return res.status(204).json({ 'message': 'No contacts found.' });
    res.json(contacts);
}

const createNewContact = async (req, res) => {
    if (!req?.body?.names || !req?.body?.email || !req?.body?.description) {
        return res.status(400).json({ 'message': 'Query names, email, and message are required' });
    }

    try {
        const result = await Contact.create({
            names: req.body.names,
            email: req.body.email,
            description: req.body.description
        });

        res.status(201).json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({'message' :` ${err}`})
    }
}

const updateContact = async (req, res) => {
    if (!req?.body?.id) {
        return res.status(400).json({ 'message': 'ID parameter is required.' });
    }

    const contact = await Contact.findOne({ _id: req.body.id }).exec();
    if (!contact) {
        return res.status(204).json({ "message": `No contact matches ID ${req.body.id}.` });
    }
    if (req.body?.names) contact.names = req.body.names;
    if (req.body?.email) contact.email = req.body.email;
    if (req.body?.description) contact.description = req.body.description;
    const result = await contact.save();
    res.json(result);
}

const deleteContact = async (req, res) => {
    if (!req?.body?.id) return res.status(400).json({ 'message': 'Contact ID required.' });

    const contact = await Contact.findOne({ _id: req.body.id }).exec();
    if (!contact) {
        return res.status(204).json({ "message": `No contact matches ID ${req.body.id}.` });
    }
    const result = await contact.deleteOne(); //{ _id: req.body.id }
    res.json(result);
}

const getContact = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ 'message': 'Contact ID required.' });

    const contact = await Contact.findOne({ _id: req.params.id }).exec();
    if (!contact) {
        return res.status(204).json({ "message": `No contact matches ID ${req.params.id}.` });
    }
    res.json(contact);
}

module.exports = {
    getAllContacts,
    createNewContact,
    updateContact,
    deleteContact,
    getContact
}