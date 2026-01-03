import { Router } from "express";
import { createContact, deleteContact, getContacts } from "../controllers/ContactController.js";

const router = Router()

router.route("/").get(getContacts); 
router.route("/").post(createContact); 
router.route("/:id").delete(deleteContact);

export default router