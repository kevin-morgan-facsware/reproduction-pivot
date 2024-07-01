import { Entity, ManyToOne, OneToMany, Collection, ManyToMany, PrimaryKeyProp } from "@mikro-orm/core";
import { Account } from "./account.entity";
import { Project } from "./project.entity";
import { User } from "./user.entity";
import { Document } from "./document.entity";


@Entity({
    tableName: 'accounts_users',
  })
  export class AccountUser {
    @ManyToOne({ entity: () => Account, primary: true })
    account: Account;
  
    @ManyToOne({ entity: () => User, primary: true, updateRule: 'cascade' })
    user: User;
  
    @OneToMany(() => Document, (document) => document.assignee)
    assignedDocuments = new Collection<Document>(this);
  
    @ManyToMany(() => Project, (project) => project.assignedUsers)
    assignedProjects = new Collection<Project>(this);
  
    [PrimaryKeyProp]?: ['account', 'user']; // this is needed for proper type checks in `FilterQuery`
  
    constructor(account: Account, user: User) {
      this.account = account;
      this.user = user;
    }
  }