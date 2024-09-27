import { Router } from "express";
import { container } from "../../../container";
import { UserController } from "../controllers/userController";


const router = Router();

const userController = container.resolve(UserController);


// router.post('/users', userController.createUser);
// router.get('/users/:id', userController.getUser);
router.put('/users/fcm-token', userController.updateUserFCMToken);


export default router;