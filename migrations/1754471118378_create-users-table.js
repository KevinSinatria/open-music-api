/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
const up = (pgm) => {
   pgm.createTable("users", {
      id: {
         type: "VARCHAR(50)",
         primaryKey: true,
      },
      username: {
         type: "VARCHAR(255)",
         notNull: true,
      },
      password: {
         type: "VARCHAR(255)",
         notNull: true,
      },
      fullname: {
         type: "VARCHAR(255)",
         notNull: true,
      },
   })
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
const down = (pgm) => {
   pgm.dropTable("users");
};

module.exports = { up, down };