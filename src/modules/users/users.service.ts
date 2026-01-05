import prisma from "@/config/db";
import bcrypt from "bcrypt";
import { CreateUserDTO, UpdateUserDTO, UserQueryParams } from "./users.schema";
import { formatPagination, getPagination } from "@/utils/pagination";
import { Prisma } from "@prisma/client";

const SALT_ROUNDS = 10;

class UsersService {
  static getUserInfo = async (userId: string) => {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        lastName: true,
        email: true,
        branch: true,
      },
    });
    const roles = await prisma.role.findMany({
      where: {
        users: {
          some: {
            userId: userId,
          },
        },
      },
      select: {
        id: true,
        name: true,
      },
    });
    const permission = await prisma.permission.findMany({
      where: {
        roles: {
          some: {
            role: {
              users: {
                some: {
                  userId: userId,
                },
              },
            },
          },
        },
      },
      select: {
        id: true,
        key: true,
      },
    });
    return { ...user, permission, roles };
  };
  static getAllUsers = async (query: UserQueryParams) => {
    const { skip, take, page, pageSize } = getPagination(
      query.page,
      query.pageSize
    );
    let where: Prisma.UserWhereInput = {};
    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: "insensitive" } },
        { lastName: { contains: query.search, mode: "insensitive" } },
        { email: { contains: query.search, mode: "insensitive" } },
      ];
    }
    let orderBy: Prisma.UserOrderByWithRelationInput = {
      createdAt: "desc",
    };
    const [usersList, total] = await prisma.$transaction([
      prisma.user.findMany({
        where,
        orderBy,
        skip,
        take,
        select: {
          id: true,
          name: true,
          lastName: true,
          email: true,
          roles: {
            select: {
              roleId: true,
            },
          },
          branch: true,
        },
      }),
      prisma.user.count({ where }),
    ]);

    return { ...formatPagination(usersList, total, page, pageSize) };
  };
  static getUserById = async (userId: string) => {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        lastName: true,
        email: true,
        branch: true,
      },
    });
    return user;
  };
  static create = async (data: CreateUserDTO) => {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });
    if (existingUser) throw new Error("Email ya registrado"); 
    const hashed = await bcrypt.hash(data.password, SALT_ROUNDS);
    const newUser = await prisma.user.create({
      data: {
        name: data.name,
        lastName: data.lastName,
        email: data.email,
        password: hashed,
        branchId: data.branchId,
      },
    });
    if (data.roles?.length) {
      await prisma.userRole.createMany({
        data: data.roles.map((roleId) => ({
          userId: newUser.id,
          roleId,
        })),
      });
    }
    return "Usuario creado exitosamente";
  };
  static update = async (userId: string, data: UpdateUserDTO) => {
    await prisma.user.update({
      where: { id: userId },
      data: {
        name: data.name,
        lastName: data.lastName,
        email: data.email,
        // password: data.password,
        branchId: data.branchId,
      },
    });
    if (data.roles?.length) {
      await prisma.userRole.deleteMany({
        where: {
          userId: userId,
        },
      });
      await prisma.userRole.createMany({
        data: data.roles.map((roleId) => ({
          userId: userId,
          roleId,
        })),
      });
    }
    return "Usuario actualizado exitosamente";
  };
  static delete = async (userId: string) => {
    await prisma.user.delete({
      where: { id: userId },
    });
    return "Usuario eliminado exitosamente";
  };
}
export default UsersService;
