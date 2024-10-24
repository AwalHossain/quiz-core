import Image from "next/image";
import { Button } from "../ui/button";

const Hero = () => {
    return (
        <div className="relative bg-gradient-to-r from-blue-100 to-blue-200 p-8 lg:min-h-[600px]">
            {/* Desktop background image */}
            <div className="absolute inset-0 hidden lg:block">
                <Image
                    src="https://res.cloudinary.com/cross-border-education-technologies-pte-ltd/image/upload/v1721890721/Shikho%20Website%20V3/Shikho%20New%20Hero%20Image%20-%20July%202024/desktop_version_sn7dpn.png"
                    alt="Background"
                    objectFit="cover"

                />
            </div>

            {/* Content */}
            <div className="relative z-10 lg:pt-20">
                <h1 className="mb-4 text-3xl font-bold text-blue-800 lg:text-white">
                    একাডেমিক থেকে এডমিশন
                </h1>
                <p className="mb-6 text-lg text-blue-600 lg:text-white">
                    প্রস্তুতি নাও দেশ সেরা শিক্ষক ও প্রযুক্তির সাথে
                </p>
                <div className="space-x-4">
                    <Button variant="default" className="bg-pink-500 hover:bg-pink-600">একাডেমিক প্রোগ্রাম দেখো</Button>
                    <Button variant="outline" className="text-pink-500 border-pink-500 hover:bg-pink-500 hover:text-white">শিখতে শুরু করো</Button>
                </div>

                {/* App icon */}
                {/* <div className="absolute left-8 bottom-32 lg:bottom-auto lg:top-32">
                    <Image src="/app-icon.png" alt="App Icon" width={50} height={50} />
                </div> */}

                {/* Stats */}
                <div className="mt-8 flex flex-wrap justify-center space-x-4 space-y-4 lg:space-y-0 lg:justify-start">
                    <Stat label="শিক্ষার্থী" value="২৫ লক্ষ+" />
                    <Stat label="অ্যাক্টিভ ইউজার" value="২০ জন+" />
                    <Stat label="অ্যাপ ডাউনলোড" value="২০ লক্ষ+" />
                    <Stat label="মাসিক এক্সামিনি" value="১.৮ লক্ষ+" />
                </div>
            </div>
        </div>
    );
};

const Stat = ({ label, value }: { label: string; value: string }) => (
    <div className="text-center bg-white p-4 rounded-lg shadow-md">
        <div className="text-2xl font-bold text-blue-800">{value}</div>
        <div className="text-sm text-blue-600">{label}</div>
    </div>
);

export default Hero;