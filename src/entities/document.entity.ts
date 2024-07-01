import { Entity, PrimaryKey, ManyToOne } from "@mikro-orm/core";
import { v4 } from "uuid";
import { AccountUser } from "./account-user.entity";
import { Account } from "./account.entity";
import { Project } from "./project.entity";

@Entity({
    tableName: 'documents',
  })
  export class Document {
    @PrimaryKey({ unique: true })
    id: string = v4();
  
    @ManyToOne(() => Project, { index: true })
    project!: Project;
  
    @ManyToOne(() => Account, { hidden: true, index: true })
    account!: Account;
  
    @ManyToOne(() => AccountUser, { nullable: true })
    assignee!: AccountUser;
  }