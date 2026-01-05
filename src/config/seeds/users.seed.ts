import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
const SALT_ROUNDS = 10;

const users = async (prisma: PrismaClient) => {
    // 1️⃣ Company
  const company = await prisma.company.create({
    data: {
      name: "Dashboard Admin",
      description: "Sistema de gestión empresarial",
    },
  });

  // 2️⃣ Branch (Sucursal principal)
  const branch = await prisma.branch.create({
    data: {
      name: "Sucursal Principal",
      address: "Dirección principal",
      phone: "999999999",
      companyId: company.id,
    },
  });

  // 3️⃣ Permissions (catálogo base)
  const permissionsData = [
    { key: "manage_users", description: "Gestionar usuarios" },
    { key: "manage_roles", description: "Gestionar roles" },
    { key: "manage_clients", description: "Gestionar clientes" },
    { key: "view_clients", description: "Ver clientes" },
    { key: "manage_company", description: "Gestionar empresa" },
  ];

  await prisma.permission.createMany({
    data: permissionsData,
    skipDuplicates: true,
  });

  const permissions = await prisma.permission.findMany();

  // 4️⃣ Role Admin
  const adminRole = await prisma.role.create({
    data: {
      name: "Admin",
      description: "Administrador del sistema",
      companyId: company.id,
    },
  });

  // 5️⃣ Asignar TODOS los permisos al Admin
  await prisma.rolePermission.createMany({
    data: permissions.map((permission) => ({
      roleId: adminRole.id,
      permissionId: permission.id,
    })),
  });

  // 6️⃣ User Admin
  const hashedPassword = await bcrypt.hash("admin123", SALT_ROUNDS);

  const adminUser = await prisma.user.create({
    data: {
      name: "Admin",
      lastName: "Principal",
      email: "admin@gmail.com",
      password: hashedPassword,
      branchId: branch.id,
    },
  });

  // 7️⃣ Asignar rol Admin al usuario
  await prisma.userRole.create({
    data: {
      userId: adminUser.id,
      roleId: adminRole.id,
    },
  });

};
export default users;