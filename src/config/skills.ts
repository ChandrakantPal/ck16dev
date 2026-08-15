export interface Skill {
  title: string;
  iconUrl: string;
  proficiency: number;
}

export const skills: Skill[] = [
  { title: "ReactJS", iconUrl: "/images/logos/react.png", proficiency: 8 },
  { title: "NextJS", iconUrl: "/images/logos/next.png", proficiency: 8 },
  {
    title: "Typescript",
    iconUrl: "/images/logos/typescript.png",
    proficiency: 8,
  },
  { title: "NodeJS", iconUrl: "/images/logos/node.png", proficiency: 8 },
  { title: "GraphQL", iconUrl: "/images/logos/graphql.png", proficiency: 7 },
  {
    title: "PostgreSQL",
    iconUrl: "/images/logos/postgresql.png",
    proficiency: 5,
  },
];
