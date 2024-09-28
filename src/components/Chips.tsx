import React from "react";

interface Item {
  id: number | string;
  name: string;
}

interface ChipsProps {
  to: string;
  items: Item[]; // Array item (universal, bisa digunakan untuk apa saja)
  baseUrl?: string; // URL dasar opsional
  renderItem?: (item: Item) => JSX.Element; // Custom rendering untuk item
  noDataMessage?: string; // Pesan jika tidak ada item
  itemClassName?: string; // Custom class untuk setiap item
  containerClassName?: string; // Custom class untuk container
}

const Chips: React.FC<ChipsProps> = ({
  items,
  baseUrl = "/discover", // URL default
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
          renderItem(item) // Jika ada fungsi custom untuk render item
        ) : (
          <a
            key={item.id}
            href={`${baseUrl}/${to}/${item.id}?name=${encodeURIComponent(
              item.name
            )}`}
          >
            <span className={itemClassName}>{item.name}</span>
          </a>
        )
      )}
    </div>
  );
};

export default Chips;
