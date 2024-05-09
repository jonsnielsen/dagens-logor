import Link from "next/link";
import { db } from "~/server/db";

const mockUrls = [
  "https://utfs.io/f/4f58b5b2-6a35-49c9-a4bf-f69cc8dd1c2e-eilcxh.webp",
  "https://utfs.io/f/8ca833b8-0889-454d-a3fe-041401697e7a-1n7x8s.webp",
  "https://utfs.io/f/565dbd57-4753-4838-9c56-5d365fd41365-eilcyc.webp",
  "https://utfs.io/f/7c69d292-cc6f-4f55-bc2f-b6ee3224df4d-vpfo60.webp",
];

const mockImages = mockUrls.map((url, i) => ({
  id: i + 1,
  url,
}));

export default async function HomePage() {
  const posts = await db.query.posts.findMany();

  console.log({ posts });
  return (
    <main className="">
      <div className="gp flex flex-wrap gap-4">
        {posts.map((post) => (
          <div key={post.id}>{post.name}</div>
        ))}
        {[...mockImages, ...mockImages, ...mockImages].map((image, index) => (
          <div key={image.id + `${index}`}>
            <img className="w-48 p-4" src={image.url} alt="image" />
          </div>
        ))}
      </div>
    </main>
  );
}
