import { GetStaticProps } from 'next'
import Image from 'next/image'

import { objectList } from '../../utils/objects'

type Props = {
  items: any
}

const WithStaticProps = ({ items }: Props) => (
    <div>
    {items.map((item) => (
        <span>
        <img title={item} width="150" src={`/images/black/${item}.svg`} />
        <img title={item} width="150" src={`/images/red/${item}.svg`} />
        <img title={item} width="150" src={`/images/blue/${item}.svg`} />
        </span>
      ))}

    </div>
)

export const getStaticProps: GetStaticProps = async () => {
  // Example for including static props in a Next.js function component page.
  // Don't forget to include the respective types for any props passed into
  // the component.
  const items: any = objectList
  return { props: { items } }
}

export default WithStaticProps
