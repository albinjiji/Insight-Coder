import Link from "next/link";

export default function Home() {
  return (
    <><h1>Hello World</h1>
      <Link href={"/landing-page"}>Landing Page</Link>
    </>
  );
}
