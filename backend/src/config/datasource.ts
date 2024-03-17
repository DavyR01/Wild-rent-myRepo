import { DataSource } from "typeorm";

const dataSource = new DataSource({
  type: "postgres",
  host: "db",
  port: 5432,
  username: "postgres",
  password: "wildrent",
  database: "postgres",
  entities: ["src/entities/*.ts"],
  synchronize: true,
  logging: ["error", "query"],
});

export default dataSource;