import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { BaseColumns } from "./BaseColumns";
import { InstitutionStatus } from "./enums";
import { User } from "./User";
import { VolunteerOpportunity } from "./VolunteerOpportunity";

@Entity("institutions")
export class Institution extends BaseColumns {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  // dono do perfil da instituicao (um User com role=INSTITUTION)
  @Index({ unique: true })
  @Column({ type: "varchar", length: 36 })
  userId!: string;

  @OneToOne(() => User, (u) => u.institution, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user!: User;

  @Column({ type: "varchar", length: 160 })
  name!: string;

  @Column({ type: "text", nullable: true })
  description?: string | null;

  @Column({ type: "varchar", length: 255, nullable: true })
  address?: string | null;

  @Column({ type: "varchar", length: 120, nullable: true })
  city?: string | null;

  @Column({ type: "simple-enum", enum: InstitutionStatus, default: InstitutionStatus.PENDING })
  status!: InstitutionStatus;

  // admin que aprovou/rejeitou (opcional)
  @Column({ type: "varchar", length: 36, nullable: true })
  reviewedByUserId?: string | null;

  @ManyToOne(() => User, { nullable: true, onDelete: "SET NULL" })
  @JoinColumn({ name: "reviewedByUserId" })
  reviewedBy?: User | null;

  @OneToMany(() => VolunteerOpportunity, (o) => o.institution)
  opportunities?: VolunteerOpportunity[];
}




