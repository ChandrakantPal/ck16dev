interface HeaderItemProps {
  title: string;
}

const HeaderItem = ({ title }: HeaderItemProps) => (
  <span className="flex ml-4 text-xl font-medium lg:mr-4 hover:text-accent">
    <span className="text-accent mr-0.5">cd </span>
    <span>./{title}</span>
  </span>
);

export default HeaderItem;
