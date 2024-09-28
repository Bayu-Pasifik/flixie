import React from "react";

interface Item {
  id: number | string;
  name: string;
}

interface ChipsProps {
  to: string;
  items: Item[];
  baseUrl?: string;
  renderItem?: (item: Item) => JSX.Element;
  noDataMessage?: string;
  itemClassName?: string;
  containerClassName?: string;
}

const Chips: React.FC<ChipsProps> = ({
  items,
  baseUrl = "/discover",
  renderItem,
  noDataMessage = "No items available.",
  itemClassName = "bg-blue-600 text-white rounded-lg px-3 py-2 text-sm",
  containerClassName = "flex flex-wrap gap-4 mt-2 mb-4",
  to
}) => {
  if (items.length === 0) {
    return <p>{noDataMessage}</p>;
  }

  return (
    <div className={containerClassName}>
      {items.map((item) =>
        renderItem ? (
          renderItem(item)
        ) : (
          <a
            key={item.id}
            href={`${baseUrl}/${to}/${item.id}`} // Removed the name parameter
          >
            <span className={itemClassName}>{item.name}</span>
          </a>
        )
      )}
    </div>
  );
};

export default Chips;
