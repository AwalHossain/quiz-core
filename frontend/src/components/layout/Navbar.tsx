"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from 'next-themes';



import Link from "next/link";
import { Button } from "../ui/button";


const Navbar = () => {
    const { theme, setTheme } = useTheme();

    return (
        <nav className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-4">
                <Link href="/">
                    {/* <img src="/logo.svg" alt="Logo" className="h-8 w-8" /> */}
                    <span className="inline-block h-8 w-8">🚀</span>
                </Link>
                <Link href="/courses">Courses</Link>
                <Link href="/practice">Practice</Link>
                <Link href="/roadmap">Roadmap</Link>
                <Link href="/newsletter">Newsletter</Link>
            </div>
            <div className="flex items-center space-x-4">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                >
                    {theme === "dark" ? <SunIcon /> : <MoonIcon />}
                </Button>
                <Button variant="default">Sign in</Button>
            </div>
        </nav>
    );
};

export default Navbar;
