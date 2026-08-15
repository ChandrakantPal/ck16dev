interface SectionHeaderProps {
  title: string;
}

const SectionHeader = ({ title }: SectionHeaderProps) => (
  <div className="flex items-center">
    <h2 className="text-2xl text-left text-green-700 md:text-4xl">./{title}</h2>
    <div className="w-3/4 ml-4 border-b border-subtle" />
  </div>
);

export default SectionHeader;
