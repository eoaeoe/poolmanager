"use strict";

const bcrypt = require("bcryptjs");

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert("users", [
      {
        id: "11111111-1111-1111-1111-111111111111",
        name: "Antonio",
        email: "antonio@poolmanager.com",
        passwordHash: bcrypt.hashSync("padilla2026", 10),
        role: "boss",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "22222222-2222-2222-2222-222222222222",
        name: "Pedro",
        email: "pedro@poolmanager.com",
        passwordHash: bcrypt.hashSync("padilla2026", 10),
        role: "employee",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("users", {
      email: ["antonio@poolmanager.com", "pedro@poolmanager.com"],
    });
  },
};
