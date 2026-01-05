import catchAsync from "@/utils/catchAsync";
import UsersService from "./users.service";
import { userQuerySchema } from "./users.schema";

class UsersController {
  static getAllUsers = catchAsync(async (req, res) => {
    const query = userQuerySchema.parse(req.query);
    const users = await UsersService.getAllUsers(query);
    res.status(200).json(users);
  });
  static getUserById = catchAsync(async (req, res) => {
    const userId = req.params.id;
    const user = await UsersService.getUserById(userId);
    res.status(200).json(user);
  });
  static create = catchAsync(async (req, res) => {
    const userData = req.body;
    const newUser = await UsersService.create(userData);
    res.status(201).json(newUser);
  });
  static update = catchAsync(async (req, res) => {
    const userId = req.params.id;
    const updateData = req.body;
    const updatedUser = await UsersService.update(userId, updateData);
    res.status(200).json(updatedUser);
  });
  static delete = catchAsync(async (req, res) => {
    const userId = req.params.id;
    await UsersService.delete(userId);
    res.status(204).send();
  });
}
export default UsersController;
