import { abs } from "@/lib/site";

export default function NotFound() {
  return (
    <div className="prose" style={{ padding: "3rem 0" }}>
      <h1>That page isn't here</h1>
      <p>
        It may have moved. Try the <a href={abs("/")}>home page</a> for every calculator.
      </p>
    </div>
  );
}
