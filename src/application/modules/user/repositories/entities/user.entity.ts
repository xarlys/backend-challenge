import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { IsOptional, IsString } from 'class-validator';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  @IsString()
  username: string;

  @Column({ type: 'varchar' })
  @IsString()
  password: string;

  @IsOptional()
  @Column({ type: 'varchar', nullable: true })
  parentUserId: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  @IsOptional()
  deletedAt: Date;
}
