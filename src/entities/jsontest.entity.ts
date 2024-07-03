import { Entity, PrimaryKey, Property } from "@mikro-orm/postgresql";
import { v4 } from "uuid";

@Entity()
export class JSONEntity {
    @PrimaryKey({ unique: true })
    id: string = v4();
    
    @Property({ type: 'jsonb', nullable: true })
    value: any;
}