import e from "express";
import { protect,authorize } from "../middlewares/auth/auth.middleware.js";
import {
    getUsers,
    getUsersbyId,
    activateUser,
    deactivateUser,
    deleteUser,
} from "../controllers/user.controller.js";

const userRouter = e.Router();

userRouter.get("/" ,protect, authorize("admin"), getUsers);
userRouter.get("/:id",protect, authorize("admin","recruiter"), getUsersbyId);
userRouter.patch("/:id/activate" ,protect, authorize("admin"),activateUser);
userRouter.patch("/:id/deactivate",protect, authorize("admin"), deactivateUser);
userRouter.delete("/:id",protect, authorize("admin"), deleteUser);



export default userRouter;

