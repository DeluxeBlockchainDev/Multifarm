import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity({ name: "users" })
export class UserModel extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: "first_name", nullable: true })
  firstName!: string;

  @Column({ name: "last_name", nullable: true })
  lastName!: string;

  @Column({ name: "auth_id", comment: "UID of user in authentication service (firebase auth)" })
  authId!: string;

  @CreateDateColumn({ name: "created_on" })
  createdOn!: Date;

  @UpdateDateColumn({ name: "updated_on" })
  updatedOn!: Date;
}
