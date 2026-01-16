import { CreateDateColumn, UpdateDateColumn } from "typeorm";

// Campos para criar e atualizar automaticamente as datas
export abstract class BaseColumns {
  // Data de criação gerenciada pelo TypeORM
  @CreateDateColumn({ type: "datetime" })
  createdAt!: Date;

  // Data de última atualização gerenciada pelo TypeORM
  @UpdateDateColumn({ type: "datetime" })
  updatedAt!: Date;
}
