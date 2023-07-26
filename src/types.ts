import { ColumnType } from "kysely";

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export interface UserTable {
    username: string;
    password: string;
    name: string;
    createdAt: Generated<Timestamp>
}

export interface PostTable {
    id: Generated<number>;
    content: string;
    createdAt: Generated<Timestamp>;
    from: string | null;
    to: string | null
}

export interface Database {
    User: UserTable
    Post: PostTable
}