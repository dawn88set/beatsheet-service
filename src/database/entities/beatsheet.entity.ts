import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  BeforeUpdate,
  BeforeInsert,
} from "typeorm";
import { BeatEntity } from "./beat.entity";

@Entity({ name: "beatsheet" })
export class BeatSheetEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 256, nullable: false })
  title: string;

  @OneToMany(() => BeatEntity, (beat: BeatEntity) => beat.beatSheet, { onDelete: "CASCADE" })
  beats?: BeatEntity[];

  @CreateDateColumn({ name: "timestamp" })
  timestamp: Date;

  @BeforeInsert()
  @BeforeUpdate()
  updateTimestamp() {
    this.timestamp = new Date();
  }
}
