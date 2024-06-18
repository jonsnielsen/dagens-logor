import { SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import { db } from "~/server/db";

export const dynamic = "force-dynamic";

async function Images() {
  // const images = await db.query.images.findMany({
  //   orderBy: (model, { desc }) => desc(model.id),
  // });

  return (
    <div className="gp flex flex-wrap gap-4">
      {/* {[...images, ...images, ...images].map((image, index) => (
        <div key={image.id + `${index}`}>
          <img className="w-48 p-4" src={image.url} alt="image" />
          <div>{image.name}</div>
        </div>
      ))} */}
    </div>
  );
}

export default async function HomePage() {
  return (
    <main className="">
      <SignedOut>
        <div className="h-full w-full text-center text-2xl">Please sign in</div>
      </SignedOut>
      <SignedIn>
        <Images />
      </SignedIn>
    </main>
  );
}
