import { Entity, PrimaryKey, ManyToMany, Collection, OneToMany } from "@mikro-orm/core";
import { v4 } from "uuid";
import { AccountUser } from "./account-user.entity";
import { Project } from "./project.entity";
import { User } from "./user.entity";

@Entity()
export class Account {
  @PrimaryKey({ unique: true })
  id: string = v4();

  // An Org has users so owner
  @ManyToMany({
    entity: () => User,
    pivotEntity: () => AccountUser,
    type: User,
  })
  users = new Collection<User>(this);

  @OneToMany(() => Project, (project) => project.account)
  projects = new Collection<Project>(this);
}