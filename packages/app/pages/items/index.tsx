import { capitalize } from "../../src/utils";

type ItemsProps = {
  colors: string[];
  objects: string[];
};

export default function Items({ colors, objects }: ItemsProps) {
  return (
    <div>
      {objects.map((object) => (
        <span>
          {colors.map((color) => (
            <img
              title={`${capitalize(color)} ${capitalize(object)}`}
              width="150"
              src={`/images/${color}/${object}.svg`}
            />
          ))}
        </span>
      ))}
    </div>
  );
}
