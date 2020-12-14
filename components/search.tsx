import { useEffect, useRef, useState } from "react";

export interface MenuItem {
  label: string;
  value: string;
}

export const MenuItems = ({
  menuItems,
  menuItemClick,
  notFound,
}: {
  menuItems: MenuItem[];
  menuItemClick?: (item: string) => void;
  notFound?: boolean;
}) => {
  if (notFound) {
    return (
      <div className="mt-2 shadow-lg w-48 rounded-md border border-gray-300 absolute z-10 bg-white overflow-auto max-h-16 ">
        <div className="p-2 m-2 rounded-md">No results found</div>
      </div>
    );
  }
  return (
    <div className="mt-2 shadow-lg w-48 rounded-md border border-gray-300 absolute z-10 bg-white overflow-auto max-h-16 ">
      {menuItems.map(({ label, value }) => (
        <div
          className="p-2 m-2 rounded-md hover:bg-gray-200 cursor-pointer"
          key={value}
          onClick={menuItemClick?.bind(this, value)}
        >
          {label}
        </div>
      ))}
    </div>
  );
};

export const Search = ({ handleChange, searchOptions, handleMenuSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState("");

  const node = useRef<HTMLDivElement | null>(null);

  const handleClickOutside = (e) => {
    if (node?.current?.contains(e?.target)) {
      return;
    }

    setIsOpen(false);
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsOpen(true);
    handleChange(e);
  };

  const onChange = (e) => {
    setSearchText(e.target.value);
    setIsOpen(true);
    handleChange(e);
  };

  return (
    <div ref={node}>
      <input
        onChange={onChange}
        type="text"
        placeholder="search..."
        className="p-2 border-2 rounded focus:outline-none"
        // onBlur={handleBlur}
        onFocus={handleFocus}
        value={searchText}
      />
      {isOpen && searchText.length !== 0 ? (
        <MenuItems
          menuItemClick={handleMenuSelect}
          menuItems={searchOptions}
          notFound={searchOptions.length === 0}
        />
      ) : null}
    </div>
  );
};
