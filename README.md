# NEXT JS DB 
### NEXT JS DATABASE TURSO SQLITE - DRIZZLE
- Go to turso
- Create database
- Go to drizzle, run this two commands
```shell
npm i drizzle-orm
npm i -D drizzle-kit
```
### NEXT JS DATABASE SET UP TURSO
- Install dotenv and @libsql/client
```shell
npm i dotenv @libsql/client
```
- env file
```env
TURSO_CONNECTION_URL=aaaaaaa
TURSO_AUTH_TOKEN=aaaaaaaa
```
### NEXT JS DATABASE SET UP DRIZZLE
- Create db folder in src folder
- Create index.ts file
```ts
import { createClient } from "@libsql/client";
import { config } from "dotenv";
import { drizzle } from "drizzle-orm/libsql";

config({path: '.env'})

const client = createClient({
  url: process.env.TURSO_CONNECTION_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN
})

export const db = drizzle(client)

```
### NEXT JS DATABASE SCHEMA FILE
- Create schema file to create table and mapping the table
```ts
import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const usersTable = sqliteTable("users",{
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  age: integer("age").notNull(),
  email: text("email").unique().notNull()
});

export const postsTable = sqliteTable("posts",{
  id: integer("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  userId: integer("user_id").notNull().references(() => usersTable.id, {onDelete: "cascade"}),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: integer("updated_at", {mode: "timestamp"}).$onUpdate(()=> new Date())
})

export type InsertUser = typeof usersTable.$inferInsert
export type SelectUser = typeof usersTable.$inferInsert

export type InsertPost = typeof postsTable.$inferInsert
export type SelectPost = typeof postsTable.$inferInsert
```
### NEXT JS DB DRIZZLE CONFIG
- Create drizzle.config.ts file in the root level (one level as .env)
```ts
import { config } from 'dotenv';
import {defineConfig} from "drizzle-kit";

config({path: ".env"})

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./migrations",
  dialect: "sqlite",
  driver: "turso",
  dbCredentials: {
    url: process.env.TURSO_CONNECTION_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!
  }
})
```
### NEXT JS DB CONNECT To TURSO
- Connect to turso after having the config file
```shell
npx drizzle-kit push
```
### NEXT JS POST AND GET DATA 
- Make sure to have schema in index.ts db export file
```ts
import { createClient } from "@libsql/client";
import { config } from "dotenv";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

config({path: '.env'})

const client = createClient({
  url: process.env.TURSO_CONNECTION_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!
})

export const db = drizzle(client, { schema })
```
- Post Code
```ts
'use server'

await db.insert(usersTable).values({
id: 1,
age: 20,
email: "test@example.com",
name: "Johnson"
})

await db.insert(postsTable).values({
title: "new post",
content: "this is the newest post",
userId: 1,
})
```
- Get Code
```ts
//get data
const post = await db.query.postsTable.findMany(); 
```
### COMPLETE FILE
```tsx
import { db } from "@/db";
import { postsTable, usersTable } from "@/db/schema";

export default async function Home() {
  
  //get data
  const post = await db.query.postsTable.findMany(); 
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        
        
        <form action={async () => {
          //post data
          'use server'

          await db.insert(usersTable).values({
            id: 1,
            age: 20,
            email: "test@example.com",
            name: "Johnson"
          })

          await db.insert(postsTable).values({
            title: "new post",
            content: "this is the newest post",
            userId: 1,
          })

        }}>
          <button>Submit</button>

          {post.map(item => {
            return (
              <div>
                {item.title}
              </div>
            )
          })}

        </form>
      </div>
    </main>
  );
}
```