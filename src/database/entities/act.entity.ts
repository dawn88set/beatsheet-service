import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  BeforeUpdate,
  JoinColumn,
  BeforeInsert, RelationId,
} from "typeorm";
import { BeatEntity } from "./beat.entity";
import { BeatSheetEntity } from "./beatsheet.entity";

@Entity({ name: "act" })
export class ActEntity {
  @PrimaryGeneratedColumn("uuid",{})
  id: string;

  @Column({ type: "text", nullable: false })
  description: string;

  @Column({ type: "bigint", nullable: false })
  duration: number;

  @Column({ type: "text", nullable: false })
  cameraAngle: string;

  @CreateDateColumn({ name: "timestamp" })
  timestamp: Date;

  @BeforeInsert()
  @BeforeUpdate()
  updateTimestamp() {
    this.timestamp = new Date(); // Update timestamp on each update
  }

  @ManyToOne(() => BeatEntity, { onDelete: "CASCADE" })
  @JoinColumn({ name: "beat_id" })
  beat: BeatEntity;

  @RelationId((act: ActEntity) => act.beat)
  beatId: string;

  @ManyToOne(() => BeatSheetEntity, { onDelete: "CASCADE" })
  @JoinColumn({ name: "beatsheet_id" })
  beatSheet: BeatSheetEntity;

  @RelationId((act: ActEntity) => act.beatSheet)
  beatSheetId: string;
}
