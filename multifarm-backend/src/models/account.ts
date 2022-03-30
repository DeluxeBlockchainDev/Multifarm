import {
  BaseEntity,
  Column,
  Entity,
  Generated,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Geometry } from "geojson";
import { CountryModel } from "./country";
import { RegionModel } from "./region";
import { createUnionType } from "type-graphql";

@Entity({ name: "accounts" })
export class AccountModel extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ unique: true })
  username!: string;

  @Column({ name: "is_merchant", default: false, nullable: true })
  isMerchant: boolean;

  @Column({ type: "text", nullable: true })
  image?: string;

  @Column({ type: "uuid", nullable: true })
  @Index({ unique: true })
  @Generated("uuid")
  tag: string;

  @Column({ name: "phone_number", nullable: true })
  phoneNumber?: string;

  @Column({ name: "city", nullable: true })
  city?: string;

  @Column({ nullable: true })
  region!: string;

  @Column({ name: "is_private", nullable: true })
  isPrivate!: boolean;

  @ManyToOne(() => CountryModel, country => country.alpha2)
  @JoinColumn({ name: "country_code" })
  country!: CountryModel;

  @ManyToOne(() => RegionModel, region => region.id)
  @JoinColumn({ name: "region_id" })
  region2!: RegionModel;

  @Column({
    name: "wyre_account",
    nullable: true,
    comment: "ID of users account on Wyre. Only applicable to US accounts",
  })
  wyreAccount: string;
}
