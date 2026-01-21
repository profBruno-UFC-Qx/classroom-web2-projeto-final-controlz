import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from "typeorm";
import { BaseColumns } from "./BaseColumns";
import { ApplicationStatus } from "./enums";
import { User } from "./User";
import { VolunteerOpportunity } from "./VolunteerOpportunity";

@Entity("applications")
@Unique("uq_applications_student_opportunity", ["studentId", "opportunityId"])
export class Application extends BaseColumns {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Index()
  @Column({ type: "varchar", length: 36 })
  studentId!: string;

  @ManyToOne(() => User, (u) => u.applications, { onDelete: "CASCADE" })
  @JoinColumn({ name: "studentId" })
  student!: User;

  @Index()
  @Column({ type: "varchar", length: 36 })
  opportunityId!: string;

  @ManyToOne(() => VolunteerOpportunity, (o) => o.applications, { onDelete: "CASCADE" })
  @JoinColumn({ name: "opportunityId" })
  opportunity!: VolunteerOpportunity;

  @Index()
  @Column({ type: "simple-enum", enum: ApplicationStatus, default: ApplicationStatus.PENDING })
  status!: ApplicationStatus;

  @Column({ type: "varchar", length: 500, nullable: true })
  institutionDocumentUrl?: string | null;

  @Column({ type: "varchar", length: 500, nullable: true })
  studentSignedDocumentUrl?: string | null;

  @Column({ type: "varchar", length: 500, nullable: true })
  finalDocumentUrl?: string | null;

  @Column({ type: "varchar", length: 500, nullable: true })
  certificateUrl?: string | null;
}




