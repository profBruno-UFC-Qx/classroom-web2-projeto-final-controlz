import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { BaseColumns } from "./BaseColumns";
import { Institution } from "./Institution";
import { Application } from "./Application";

@Entity("volunteer_opportunities")
export class VolunteerOpportunity extends BaseColumns {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Index()
  @Column({ type: "varchar", length: 36 })
  institutionId!: string;

  @ManyToOne(() => Institution, (i) => i.opportunities, { onDelete: "CASCADE" })
  @JoinColumn({ name: "institutionId" })
  institution!: Institution;

  @Column({ type: "varchar", length: 160 })
  title!: string;

  @Column({ type: "text" })
  description!: string;

  @Index()
  @Column({ type: "varchar", length: 80, nullable: true })
  category?: string | null;

  @Index()
  @Column({ type: "varchar", length: 120, nullable: true })
  city?: string | null;

  @Column({ type: "integer", default: 0 })
  workloadHours!: number;

  @Column({ type: "boolean", default: true })
  isActive!: boolean;

  @OneToMany(() => Application, (a) => a.opportunity)
  applications?: Application[];
}




