import NavState from "./NavState";


const Navbar = async () => {

    // const { registration, login } = dictionary;

    return (
        <nav className="bg-background px-2 md:px-6 dark:bg-dark-background py-4 border-b">
            <div className="flex items-center justify-between space-x-6">
                <div className="w-full">
                    {/* Pass dictionary.navLink and dictionary.profile as locale */}
                    <NavState />
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
