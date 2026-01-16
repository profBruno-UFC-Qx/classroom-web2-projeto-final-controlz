import {
  Column,
  Entity,
  Index,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Application } from "./Application";
import { BaseColumns } from "./BaseColumns";
import { UserRole } from "./enums";
import { Institution } from "./Institution";

@Entity("users")
// Entidade principal de usuario que compartilha colunas base
export class User extends BaseColumns {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  // Nome completo do usuario
  @Column({ type: "varchar", length: 120 })
  name!: string;

  // Email unico para login/contato
  @Index({ unique: true })
  @Column({ type: "varchar", length: 180 })
  email!: string;

  // Hash (bcrypt/argon2) vai ser implementado na camada de auth/service
  @Column({ type: "varchar", length: 255 })
  passwordHash!: string;

  // Perfil do usuario: ADMIN, STUDENT ou INSTITUTION
  @Column({ type: "simple-enum", enum: UserRole })
  role!: UserRole;

  // so existe quando role === INSTITUTION
  @OneToOne(() => Institution, (i) => i.user)
  institution?: Institution;

  // so existe quando role === STUDENT
  @OneToMany(() => Application, (a) => a.student)
  applications?: Application[];
}
