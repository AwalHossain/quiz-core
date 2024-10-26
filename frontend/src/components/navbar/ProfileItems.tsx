import { ListIcon, LogOut, UserIcon } from "lucide-react";

const ProfileItems = [
    {
        key: "MyAccount",
        label: "আমার অ্যাকাউন্ট",
        url: "#",
        icon: (
            <UserIcon className="w-5 h-5 text-custom-content-tertiary group-hover:text-custom-content-white" />
        ),
    },
    {
        key: "MyInformation",
        label: "আমার দেওয়া তথ্যগুলো",
        url: "#",
        icon: (
            <ListIcon className="w-5 h-5 text-custom-content-tertiary group-hover:text-custom-content-white" />
        ),
    },
    {
        key: "Logout",
        label: "লগ আউট",
        url: "#",
        icon: (
            <LogOut className="w-5 h-5 text-custom-content-tertiary group-hover:text-custom-content-white" />
        ),
        action: "logout",
    },
];

export default ProfileItems;
