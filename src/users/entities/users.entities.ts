import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'user_account' })
export class AccountDocuments {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  firstName?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  lastName?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  area?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  country?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  region?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  address?: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  gmtOffset?: string;

  @Column({ type: 'date', nullable: true })
  dob?: Date;

  @CreateDateColumn({
    type: 'timestamp',
    select: false,
  })
  created_at?: Date | string;

  @UpdateDateColumn({
    type: 'timestamp',
    nullable: true,
    select: false,
  })
  updated_at?: Date | string;

  @DeleteDateColumn({
    type: 'timestamp',
    nullable: true,
    select: false,
  })
  deleted_at?: Date | string;

  constructor(init?: Partial<AccountDocuments>) {
    Object.assign(this, init);
  }
}
