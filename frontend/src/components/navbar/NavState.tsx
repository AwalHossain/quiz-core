/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";


import { ModeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

import AuthFlow from "@/app/(group)/home/auth/AuthFlow";
import { useAuth } from "@/context/AuthProvider";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Leaf, Menu } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
import ProfileItems from "./ProfileItems";


const NavState = () => {

    const { user, logout } = useAuth();
    const [isDropdownOpen, setIsDropdownOpen] = useState<number | null>(null);
    const [menuOpen, setMenuOpen] = useState(false);



    const handleDropdownOpenChange = (index: number) => {
        setIsDropdownOpen(isDropdownOpen === index ? null : index);
    };

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const getInitial = (name: string) => {
        return name.charAt(0).toUpperCase();
    };

    const menuRef = useRef<HTMLDivElement>(null);

    const handleItemClick = (item: any) => {
        if (item.action === "logout") {
            logout();
            window.location.href = "/";
        } else if (item.url) {
            window.location.href = item.url;
        }
    };

    // useEffect(() => {
    //     const handleClickOutside = (event: MouseEvent) => {
    //         if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
    //             setMenuOpen(false);
    //         }
    //     };

    //     document.addEventListener("mousedown", handleClickOutside);
    //     return () => {
    //         document.removeEventListener("mousedown", handleClickOutside);
    //     };
    // }, []);

    const menuVariants = {
        closed: { opacity: 0, y: -20 },
        open: { opacity: 1, y: 0 }
    };

    const itemVariants = {
        closed: { opacity: 0, x: -20 },
        open: { opacity: 1, x: 0 }
    };


    return (
        <div className="">
            <div className=" flex items-center justify-between w-full px-5 ">
                <div className="h-12 w-28">
                    <Link href="/">
                        <Leaf className="w-8 h-8 text-primary" />
                    </Link>
                </div>
                <div className="flex w-full items-center lg:justify-between px-6 gap-3">
                    <div className="hidden xl:flex items-center gap-4">
                        {/* {NavLinks.map((link, index) =>
                            link.isDropdown ? (
                                <DropdownMenu key={index} onOpenChange={() => handleDropdownOpenChange(index)}>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="link"
                                            className="flex items-center text-custom-content-secondary dark:text-custom-content-white dark:hover:text-secondary hover:text-secondary"
                                        >
                                            {[link.key]}
                                            <ChevronDown
                                                className={`ml-1 w-4 h-4 transition-transform duration-300 ${isDropdownOpen === index ? "rotate-180" : "rotate-0"
                                                    }`}
                                            />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="bg-background dark:bg-dark-background rounded-xl p-1">
                                        {link.dropdownItems.map((dropdownItem, subIndex) => (
                                            <DropdownMenuItem
                                                className="group hover:bg-green-500 rounded-xl"
                                                key={subIndex}
                                            >
                                                <Link
                                                    href={dropdownItem.url}
                                                    className="no-underline text-custom-content-secondary group-hover:text-custom-content-white dark:text-custom-content-white p-1"
                                                >
                                                    {[dropdownItem.key]}
                                                </Link>
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ) : (
                                <Link
                                    key={index}
                                    href={link.url}
                                    className="text-custom-content-secondary dark:text-custom-content-white dark:hover:text-secondary hover:text-secondary no-underline"
                                >

                                    {link.label}
                                </Link>
                            )
                        )} */}
                    </div>
                </div>

                <div className="hidden xl:flex lg:w-1/4 lg:justify-end items-center gap-2">
                    {/* <ModeToggle /> */}
                    {/* <TweakLanguage /> */}

                    {user?.username ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="flex items-center space-x-2 px-1 py-2 border rounded-xl border-primary dark:border-custom-content-white"
                                >
                                    <div className="w-8 h-8 rounded-full bg-secondary text-custom-content-white flex items-center justify-center font-semibold">
                                        {getInitial(user.username || 'U')}
                                    </div>
                                    <ChevronDown
                                        className={`w-5 h-5 transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : "rotate-0"
                                            }`}
                                    />
                                </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent className="z-50 bg-background dark:bg-dark-background rounded-xl p-2 mt-2 shadow-lg">
                                {ProfileItems.map((item, index) => (
                                    <DropdownMenuItem key={index} className="group rounded-xl p-1">
                                        <Link href={item.url}>
                                            <button className="text-custom-content-tertiary  flex items-center group-hover:text-custom-content-white rounded-xl p-1 gap-2"
                                                onClick={() => handleItemClick(item)}
                                            >
                                                {item.icon}
                                                {item.label}
                                            </button>
                                        </Link>
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (

                        <AuthFlow />

                    )}
                </div>

                <button
                    onClick={toggleMenu}
                    className="xl:hidden flex items-center p-1 border rounded-lg text-primary border-primary dark:border-custom-content-white"
                >
                    <Menu className="w-6 h-6 text-secondary p-1 " />
                    Menu
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>

                {menuOpen && (
                    <motion.div
                        key="mobile-menu"
                        ref={menuRef}
                        className="xl:hidden mt-4 bg-background dark:bg-dark-background shadow-lg rounded-lg overflow-hidden"
                        initial="closed"
                        animate="open"
                        exit="closed"
                        variants={menuVariants}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="xl:hidden mt-4">
                            <div className="flex justify-between h-auto p-2 m-2">
                                <ModeToggle />
                                {/* <TweakLanguage /> */}
                            </div>
                            <motion.div className="flex flex-col space-y-2 px-4">

                                {/* Conditional rendering of user menu */}
                                {user?.username ? (
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className="flex items-center space-x-2 px-1 py-2 border hover:bg-green-600 dark:text-custom-content-white border-primary hover:border-transparent dark:border-custom-content-white"
                                            >
                                                <div className="w-8 h-8 rounded-full bg-primary text-custom-content-white flex items-center justify-center font-semibold">
                                                    {getInitial(user.username || 'U')}
                                                </div>
                                                <ChevronDown
                                                    className={`w-5 h-5 transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : "rotate-0"
                                                        }`}
                                                />
                                            </Button>
                                        </DropdownMenuTrigger>

                                        <DropdownMenuContent className="z-50 bg-background border w-full dark:bg-dark-background rounded-xl p-1 mt-2 shadow-lg">
                                            {ProfileItems.map((item, index) => (
                                                <DropdownMenuItem key={index} className="group rounded-xl p-1">
                                                    <Link href={item.url}
                                                        onClick={() => handleItemClick(item)}
                                                    >
                                                        <div className="text-custom-content-tertiary  flex items-center group-hover:text-custom-content-white rounded-xl p-1 gap-2">
                                                            {item.icon}
                                                            {item.label}
                                                        </div>
                                                    </Link>
                                                </DropdownMenuItem>
                                            ))}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                ) : (
                                    <AuthFlow />
                                )}
                                <Button
                                    variant="default"
                                    className="w-full px-4 py-2 bg-primary text-custom-content-white"
                                >
                                    Give Information
                                </Button>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
};

export default NavState;
