import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  BeforeUpdate,
  RelationId, BeforeInsert,
} from "typeorm";
import { ActEntity } from "./act.entity";
import { BeatSheetEntity } from "./beatsheet.entity";

@Entity({ name: "beat" })
export class BeatEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "text", nullable: false })
  description: string;

  @CreateDateColumn({ name: "timestamp" })
  timestamp: Date;

  @BeforeInsert()
  @BeforeUpdate()
  updateTimestamp() {
    this.timestamp = new Date(); // Update timestamp on each update
  }

  @ManyToOne(() => BeatSheetEntity, { onDelete: "CASCADE" })
  @JoinColumn({ name: "beatsheet_id" })
  beatSheet: BeatSheetEntity;

  @RelationId((beat: BeatEntity) => beat.beatSheet)
  beatSheetId: string;

  @OneToMany(() => ActEntity, (act: ActEntity) => act.beat, { onDelete: "CASCADE" })
  acts: ActEntity[];
}
