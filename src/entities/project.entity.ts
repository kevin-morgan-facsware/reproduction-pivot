import { Entity, PrimaryKey, Property, ManyToOne, OneToMany, Collection, ManyToMany } from "@mikro-orm/core";
import { v4 } from "uuid";
import { AccountUser } from "./account-user.entity";
import { Account } from "./account.entity";
import { Document } from "./document.entity";

@Entity({
    tableName: 'projects',
  })
  export class Project {
    @PrimaryKey({ unique: true })
    id: string = v4();
  
    @Property()
    name!: string;
  
    @ManyToOne(() => Account, { nullable: true, hidden: true, index: true })
    account?: Account;
  
    @OneToMany(() => Document, (document) => document.project)
    documents = new Collection<Document>(this);
  
    @ManyToMany(() => AccountUser, 'assignedProjects', { owner: true })
    assignedUsers = new Collection<AccountUser>(this);
  }