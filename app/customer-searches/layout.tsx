export default function CustomerSearchesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full bg-white dark:bg-neutral-950">
      <div className=" ">{children}</div>
    </div>
  );
}
