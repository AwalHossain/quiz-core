const NavLinks = [
    {
        key: "ListOfMartyrs",
        label: "তালিকা",
        url: "#",
        isDropdown: true,
        dropdownItems: [
            { key: "ListOfMartyrs", label: "শহীদদের তালিকা", url: "#" },
            { key: "ListOfInjured", label: "আহতদের তালিকা", url: "#" },
            { key: "ListOfArrested", label: "গ্রেফতারকৃতদের তালিকা", url: "#" },
        ],
    },
    { key: "PhotosAndVideos", label: "ছবি ও ভিডিও", url: "#" },
    { key: "NewsAndEvents", label: "নিউজ বা ঘটনা", url: "#" },
    { key: "HistoryOfTheMovement", label: "আন্দোলনের ইতিহাস", url: "#" },
    { key: "Podcast", label: "পডকাস্ট", url: "#" },
    { key: "AboutUs", label: "আমাদের সম্পর্কে", url: "/about" },
];

export default NavLinks;
