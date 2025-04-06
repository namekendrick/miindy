export default async function AuthLayout({ children }) {
  return (
    <div className="flex h-full w-full items-center justify-center">
      {children}
    </div>
  );
}
