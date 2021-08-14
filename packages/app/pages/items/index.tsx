import { GetStaticProps } from "next";

import { capitalize } from "../../src/utils";

import colors from "../../data/colors.json";
import objects from "../../data/objects.json";

type Props = {
  colors: string[];
  objects: string[];
};

const Items = ({ colors, objects }: Props) => (
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

export const getStaticProps: GetStaticProps = async () => {
  return { props: { colors, objects } };
};

export default Items;
