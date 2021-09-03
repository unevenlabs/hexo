import { CheckIcon } from '@heroicons/react/outline'

const features = [
  {
    name: 'On-chain Metadata!',
    description: 'Premium JSON served straight from the contract',
  },
  {
    name: 'reddragon.hexo.eth',
    description:
      'Every Hexo comes with an ENS name and one-click reverse record setup',
  },
  {
    name: "Look Ma, I'm a DAO!",
    description:
      'Community can <a class="underline" href="https://snapshot.org/#/hexocodes.eth">vote</a> to add new colors, objects or default images',
  },
  {
    name: 'Updateable images!',
    description: 'Owners can override the default <a class="underline" href="https://openmoji.org/">OpenMoji</a> images with their own',
  },
]

const Features = () => (
  <div className="bg-gray-50 pt-8 lg:pt-12">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          Standard ERC-721, with some fun bonuses
        </h2>
      </div>

      <dl className="mt-16 space-y-10 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:gap-y-12 lg:grid-cols-4 lg:gap-x-8">
        {features.map((feature) => (
          <div key={feature.name} className="relative">
            <dt>
              <CheckIcon
                className="absolute h-6 w-6 text-green-500"
                aria-hidden="true"
              />
              <p className="ml-9 text-lg leading-6 font-medium text-gray-900">
                {feature.name}
              </p>
            </dt>
            <dd className="mt-2 ml-9 text-base text-gray-500" dangerouslySetInnerHTML={{__html: feature.description}}></dd>
          </div>
        ))}
      </dl>
    </div>
  </div>
)

export default Features
