import { CreateDateColumn, UpdateDateColumn } from "typeorm";

export abstract class BaseColumns {
  @CreateDateColumn({ type: "datetime" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "datetime" })
  updatedAt!: Date;
}




