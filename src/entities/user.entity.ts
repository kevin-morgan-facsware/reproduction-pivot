import { Entity, PrimaryKey, Property, ManyToMany, Collection } from "@mikro-orm/core";
import { v4 } from "uuid";
import { Account } from "./account.entity";

@Entity()
export class User {

  @PrimaryKey({ unique: true })
  id: string = v4();
 
  @Property({ unique: true })
  email!: string;

  @ManyToMany({ entity: () => Account, mappedBy: (o) => o.users })
  accounts = new Collection<Account>(this);
}
