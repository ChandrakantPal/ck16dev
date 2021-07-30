import { FC } from 'react'

interface SectionHeaderProp {
  title: string
}

const SectionHeader: FC<SectionHeaderProp> = ({ title }) => {
  return (
    <div className="flex items-center">
      <h1 className="text-2xl text-left text-green-700 md:text-4xl">
        ./{title}
      </h1>
      <div className="w-3/4 ml-4 border-b border-gray-500" />
    </div>
  )
}

export default SectionHeader
