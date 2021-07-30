import Aos from 'aos'
import { FC, useEffect } from 'react'

interface SkillProp {
  title: string
  url: string
  proficiency: number
}

const Skill: FC<SkillProp> = ({ title, url, proficiency }) => {
  useEffect(() => {
    Aos.init()
  }, [])
  const rating = `${'**'.repeat(proficiency)}${'..'.repeat(10 - proficiency)}`
  return (
    <>
      <div
        data-aos="fade-up"
        className="flex flex-wrap items-start w-full mb-7 md:my-16 md:justify-around"
      >
        <div className="flex items-center">
          <div className="w-12 h-12 mr-2 md:w-16 md:h-16">
            <img
              src={url}
              className="object-contain max-w-full filter invert"
            />
          </div>
          <p className="text-gray-500 md:text-2xl">{title}</p>
        </div>
        <p className="mt-1 text-gray-500 md:text-2xl md:mt-0">
          [{rating}] and learning
        </p>
      </div>
    </>
  )
}

export default Skill
