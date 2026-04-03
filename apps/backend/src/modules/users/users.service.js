import bcrypt from "bcryptjs";
import { Op } from "sequelize";
import { User } from "../../../models/index.js";

export async function findUsersPaginated({
  page,
  limit,
  search,
  sortField,
  sortOrder,
}) {
  const offset = (page - 1) * limit;

  const where = {};

  if (search) {
    where[Op.or] = [
      { name: { [Op.iLike]: `%${search}%` } },
      { email: { [Op.iLike]: `%${search}%` } },
    ];
  }

  const allowedSortFields = ["name", "email", "role", "createdAt"];
  const safeSortField = allowedSortFields.includes(sortField)
    ? sortField
    : "createdAt";

  const safeSortOrder = sortOrder === "ASC" ? "ASC" : "DESC";

  const { rows, count } = await User.findAndCountAll({
    attributes: ["id", "name", "email", "role", "createdAt"],
    where,
    offset,
    limit,
    order: [[safeSortField, safeSortOrder]],
  });

  return {
    users: rows,
    total: count,
    page,
    limit,
    totalPages: Math.ceil(count / limit),
  };
}

export async function findUserByEmail(email) {
  return User.findOne({
    where: { email },
  });
}

export async function findUserById(id) {
  return User.findByPk(id);
}

export async function createUser({ name, email, password, role }) {
  const passwordHash = await bcrypt.hash(password, 10);

  return User.create({
    name,
    email,
    passwordHash,
    role,
  });
}

export async function updateUser(id, { name, email, role, password }) {
  const user = await User.findByPk(id);

  if (!user) {
    return null;
  }

  user.name = name ?? user.name;
  user.email = email ?? user.email;
  user.role = role ?? user.role;

  if (password) {
    user.passwordHash = await bcrypt.hash(password, 10);
  }

  await user.save();

  return user;
}

export async function deleteUser(id) {
  const deletedCount = await User.destroy({
    where: { id },
  });

  return deletedCount > 0;
}
