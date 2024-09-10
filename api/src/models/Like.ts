import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Like {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  cat_id: string;

  @Column()
  created_at: Date;
}