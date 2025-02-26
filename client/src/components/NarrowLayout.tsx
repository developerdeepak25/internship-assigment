const NarrowLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="container mx-auto py-16 max-sm:px-4 px-12 w-full">{children}</div>
  );
};

export default NarrowLayout;
