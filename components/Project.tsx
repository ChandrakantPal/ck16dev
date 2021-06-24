import { FC } from 'react'

interface ProjectProp {
  link: string
  title: string
  stack: string
}

const Project: FC<ProjectProp> = ({ link, title, stack }) => {
  return (
    <a
      href={link}
      className="flex flex-col items-center justify-center w-full rounded-lg"
      target="_blank"
    >
      <img
        src="/images/logos/project.png"
        className="object-contain w-32 md:w-40"
      />
      <p className="w-2/3 mt-2 text-sm text-center text-gray-500">
        Title - {title}
      </p>
      <p className="w-2/3 mt-2 text-sm text-center text-gray-500">
        Stack - {stack}
      </p>
    </a>
  )
}

export default Project
