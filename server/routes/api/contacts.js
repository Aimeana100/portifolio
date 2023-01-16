const express = require('express');
const router = express.Router();
const ContactsController = require('../../controllers/ContactsController');

router.route('/')
    .get(ContactsController.getAllContacts)
    .post( ContactsController.createNewContact)
    .put( ContactsController.updateContact)
    .delete(ContactsController.deleteContact);

router.route('/:id')
    .get(ContactsController.getContact);

module.exports = router;