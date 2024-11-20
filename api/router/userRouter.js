import express from "express";
import {
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
  userLogin,
  userRegister,
  userRegisterAdmin,
} from "../controller/userController.js";

const userRouter = express.Router();

userRouter.post("/login", userLogin);
userRouter.post("/register", userRegister);
userRouter.post("/register-admin", userRegisterAdmin);
userRouter.get("/", getUsers);
userRouter.get("/:id", getUserById);
userRouter.put("/:id", updateUser);
userRouter.delete("/:id", deleteUser);

export default userRouter;
