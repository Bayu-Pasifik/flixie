export const LayoutTemplate = ({
  layout,
  children,
}: {
  layout: string;
  children: React.ReactNode;
}) => {
  if (layout === "card") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
        {children}
      </div>
    );
  } else if (layout === "list") {
    return (
      <div className="grid-cols-1 gap-1 md:grid-cols-1 lg:grid-cols-1 2xl:grid-cols-1">
        {children}
      </div>
    );
  }else if(layout === "mini"){
    return (
      <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-7 xl:grid-cols-7 2xl:grid-cols-9 gap-4">
        {children}
      </div>
    );
  }
};
