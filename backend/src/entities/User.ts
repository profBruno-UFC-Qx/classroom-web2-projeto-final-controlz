import {
  Column,
  Entity,
  Index,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { BaseColumns } from "./BaseColumns";
import { UserRole } from "./enums";
import { Institution } from "./Institution";
import { Application } from "./Application";

@Entity("users")
export class User extends BaseColumns {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 120 })
  name!: string;

  @Index({ unique: true })
  @Column({ type: "varchar", length: 180 })
  email!: string;

  // Hash (bcrypt/argon2) vai ser implementado na camada de auth/service
  @Column({ type: "varchar", length: 255 })
  passwordHash!: string;

  @Column({ type: "simple-enum", enum: UserRole })
  role!: UserRole;

  // so existe quando role === INSTITUTION
  @OneToOne(() => Institution, (i) => i.user)
  institution?: Institution;

  // so existe quando role === STUDENT
  @OneToMany(() => Application, (a) => a.student)
  applications?: Application[];
}




