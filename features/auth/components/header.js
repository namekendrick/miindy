import Link from "next/link";

export const Header = ({ label }) => {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-y-4">
      <Link href="/">
        <h1 className="text-3xl font-bold">Miindy</h1>
      </Link>

      <h2 className="text-md text-muted-foreground">{label}</h2>
    </div>
  );
};
