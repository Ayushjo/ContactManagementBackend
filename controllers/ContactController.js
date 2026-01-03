import { Contact } from "../models/Contacts.js";

export const getContacts = async (req, res) => {
  try {
    const { sort } = req.query;
    let contacts;
    if (sort === "name") {
      contacts = await Contact.find().sort({ name: 1 }); // A-Z
    } else {
      contacts = await Contact.find().sort({ createdAt: -1 }); // newest first
    }
    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch contacts. Please try again.",
      error: error.message,
    });
  }
};
export const createContact = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    if (!name || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and phone are required fields",
        errors: {
          name: !name ? "Name is required" : null,
          email: !email ? "Email is required" : null,
          phone: !phone ? "Phone is required" : null,
        },
      });
    }
    const contact = await Contact.create({
      name,
      email,
      phone,
      message: message || "",
    });
    res.status(201).json({
      success: true,
      message: "Contact added successfully!",
      data: contact,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = {};
      Object.keys(error.errors).forEach((key) => {
        errors[key] = error.errors[key].message;
      });

      return res.status(400).json({
        success: false,
        message: Object.values(errors)[0],
      });
    }
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "This contact already exists",
      });
    }
    res.status(500).json({
      success: false,
      message: "Failed to create contact. Please try again.",
      error: error.message,
    });
  }
};
export const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found or already deleted",
      });
    }
    await contact.deleteOne();
    res.status(200).json({
      success: true,
      message: "Contact deleted successfully!",
    });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(400).json({
        success: false,
        message: "Invalid contact ID",
      });
    }
    res.status(500).json({
      success: false,
      message: "Failed to delete contact. Please try again.",
      error: error.message,
    });
  }
};
