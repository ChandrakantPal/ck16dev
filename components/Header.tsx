const Header = () => {
  return (
    <header className="flex flex-wrap items-start justify-between p-4">
      <div className="flex justify-center">
        <h1 className="text-4xl font-semibold">ck16 {'>'}_</h1>
        <span className="ml-4 border-l-8 border-green-700 border-solid max-h-9 animate-pulse" />
      </div>
      <div className="flex">
        <p className="mx-2 text-xl font-medium hover:text-green-500">
          cd ./about
        </p>
        <p className="mx-2 text-xl font-medium hover:text-green-500">
          cd ./skills
        </p>
        <p className="mx-2 text-xl font-medium hover:text-green-500">
          cd ./work
        </p>
        <p className="mx-2 text-xl font-medium hover:text-green-500">
          cd ./contact
        </p>
      </div>
    </header>
  )
}

export default Header
