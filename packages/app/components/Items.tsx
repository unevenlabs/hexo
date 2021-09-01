import colors from "data/colors.json";
import objects from "data/objects.json";

const Items = ({ mintedItems }: { mintedItems: any }) => {
  return (
    <dl className="mt-16">
      {colors.map((color) => {
        objects.slice(0, 1).map((object) => {
          const data = mintedItems[`${color}${object}`];

          return {
            color,
            object,
            data,
          };

          // If name filtering is on, prioritize it
          //   if (filter !== "" && !currentItem.includes(filter)) {
          //     return null;
          //   }

          //   if (show === "AVAILABLE") {
          //     // Only show items that were not yet minted
          //     !data ? output : null;
          //   } else if (show === "OWNED") {
          //     // Only show items owner by the current account
          //     data && data.owner === address.toLowerCase()
          //       ? output
          //       : null;
          //   }
        });
      })}
    </dl>
  );
};

export default Items;
