import z from "zod";
export const userQuerySchema = z.object({
  search: z.string().optional(),
  sortBy: z
    .enum(["name", "lastName", "email", "createdAt"])
    .default("createdAt"),

  sortOrder: z.enum(["asc", "desc"]).default("asc"),
  //   status: z.string().optional(),
  roles: z
    .string()
    .transform((val) => val.split(","))
    .optional(),

  page: z.preprocess((val) => Number(val), z.number().int().min(1)).default(1),

  pageSize: z
    .preprocess((val) => Number(val), z.number().int().min(1).max(100))
    .default(10),
});
export const createUserSchema = z.object({
    name: z.string().min(2).max(50),
    lastName: z.string().min(2).max(50),
    email: z.email(),
    password: z.string().min(6).max(100),
    branchId: z.uuid(),
    roles: z
      .string()
      .transform((val) => val.split(","))
      .optional(),
});
export const userSchema = z.object({
    id: z.uuid(),
    name: z.string().min(2).max(50),
    lastName: z.string().min(2).max(50),
    email: z.string().email(),
    branch: z.object({
      id: z.string().uuid(),
      name: z.string(),
    }),
    roles: z.array(
      z.object({
        id: z.string().uuid(),
        key: z.string(),
      })
    ),
    permission: z.array(
      z.object({
        id: z.string().uuid(),
        key: z.string(),
      })
    ),
})
export const usersResponseSchema = z.object({
    usersList: z.array(userSchema),
    total: z.number(),
    page: z.number(),
    pageSize: z.number(),
})

export type UserResponseDTO = z.infer<typeof usersResponseSchema>;
export type UserQueryParams = z.infer<typeof userQuerySchema>;
export type CreateUserDTO = z.infer<typeof createUserSchema>;
export type UpdateUserDTO = Partial<CreateUserDTO>;