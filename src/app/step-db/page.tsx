import { db } from "@/db";
import { postsTable, usersTable } from "@/db/schema";
import generateUID from "@/helper/uuid";
import { revalidatePath } from "next/cache";
import { useEffect } from "react";

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
            age: Math.ceil(Math.random() * 100),
            email: generateUID() + "@example.com",
            name: "Johnson"
          })

          await db.insert(postsTable).values({
            title: "new post",
            content: "this is the newest post",
            userId: 1,
          })
          revalidatePath("/step-db/")
        }}>
          <button className="bg-slate-700 transition-colors hover:text-black hover:bg-slate-100 p-2 mb-3 rounded-md ">Submit</button>

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
