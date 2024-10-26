import Footer from "@/components/layout/Footer";
import { ReactNode } from "react";
import { Button } from "../../components/ui/button";

const layout = ({
    children,
}: Readonly<{
    children: ReactNode;
}>) => {
    return (
        <div>
            <div className="relative">
                {/* <div className="absolute inset-0 hidden lg:block">
              <Image
                src="https://res.cloudinary.com/cross-border-education-technologies-pte-ltd/image/upload/v1721890721/Shikho%20Website%20V3/Shikho%20New%20Hero%20Image%20-%20July%202024/desktop_version_sn7dpn.png"
                alt="Background"
                width={0}
                height={0}
                sizes="100vw"
                style={{ width: '100%', height: 'auto' }} // optional
              />
            </div> */}
                <section className="hidden lg:block h-[478px] w-full bg-cover bg-center bg-no-repeat sm:h-[500px] md:mt-[-22px] lg:h-[630px] bg-[url('https://res.cloudinary.com/cross-border-education-technologies-pte-ltd/image/upload/v1721890721/Shikho%20Website%20V3/Shikho%20New%20Hero%20Image%20-%20July%202024/mobile_responsive_punqka.png')] lg:bg-[url('https://res.cloudinary.com/cross-border-education-technologies-pte-ltd/image/upload/v1721890721/Shikho%20Website%20V3/Shikho%20New%20Hero%20Image%20-%20July%202024/desktop_version_sn7dpn.png')]">
                    <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:h-full lg:px-8">
                        <div className="grid w-full grid-cols-12 lg:h-full ">
                            <div className=" col-span-12  md:col-span-7 md:pt-[90px] lg:pt-[120px]">
                                <h1 className="mb-4 text-6xl font-bold text-primary ">
                                    একাডেমিক থেকে এডমিশন
                                </h1>
                                <p className="mb-6 text-4xl text-custom-green-light ">
                                    প্রস্তুতি নাও দেশ সেরা শিক্ষক ও প্রযুক্তির সাথে
                                </p>
                                <div className="grid items-center gap-[20px] pt-[32px] md:flex">
                                    <Button variant="default" className=" ">একাডেমিক প্রোগ্রাম দেখো</Button>
                                    <Button variant="outline" className="  hover:bg-primary hover:text-white">শিখতে শুরু করো</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                {/* <div className="relative bg-gradient-to-r from-blue-100 to-blue-200 p-8 lg:min-h-[600px]">
                    {/* Desktop background image */}
                {/* <div className="absolute inset-0 hidden lg:block">
                    <Image
                        src="https://res.cloudinary.com/cross-border-education-technologies-pte-ltd/image/upload/v1721890721/Shikho%20Website%20V3/Shikho%20New%20Hero%20Image%20-%20July%202024/desktop_version_sn7dpn.png"
                        alt="Background"
                        objectFit="cover"
                        width={0}
                        height={0}
                        sizes="100vw"
                        style={{ width: '100%', height: 'auto' }} // optional

                    />
                </div> */}

                {/* Content */}
                <div className="lg:hidden min-h-[500px] bg-gradient-to-r from-blue-100 to-blue-200 flex flex-col items-center justify-center z-10 lg:pt-20">
                    <h1 className="mb-4 text-center text-3xl md:text-6xl font-bold text-primary lg:text-white">
                        একাডেমিক থেকে এডমিশন
                    </h1>
                    <p className="mb-6 text-center text-2xl md:text-4xl text-pink-600 lg:text-white">
                        প্রস্তুতি নাও দেশ সেরা শিক্ষক ও প্রযুক্তির সাথে
                    </p>
                    <div className="flex flex-col md:flex-row gap-4">
                        <Button variant="default" className="bg-pink-500 hover:bg-pink-600">একাডেমিক প্রোগ্রাম দেখো</Button>
                        <Button variant="outline" className="text-pink-500 border-pink-500 hover:bg-pink-500 hover:text-white">শিখতে শুরু করো</Button>
                    </div>

                </div>
                {/* Stats */}
                <div className="mt-0 sm:-mt-14 bg-white shadow-lg mx-4 sm:mx-8 px-4 sm:px-8 py-8 rounded-lg">
                    <div className="flex flex-wrap justify-between">
                        <StatItem
                            value="২৫ লক্ষ+"
                            label="শিক্ষার্থী"
                            valueColor="text-pink-500"
                            className="w-[45%] sm:w-auto"
                        />
                        <StatItem
                            value="২০ জন+"
                            label="অ্যাক্টিভ ইউজার"
                            valueColor="text-[#3DAFFD]"
                            className="w-[45%] sm:w-auto"
                        />
                        <StatItem
                            value="২০ লক্ষ+"
                            label="অ্যাপ ডাউনলোড"
                            valueColor="text-[#00B19E]"
                            className="w-[45%] sm:w-auto mt-4 sm:mt-0"
                        />
                        <StatItem
                            value="১.৮ লক্ষ+"
                            label="মাসিক এক্সামিনি"
                            valueColor="text-[#EAA819]"
                            className="w-[45%] sm:w-auto mt-4 sm:mt-0"
                        />
                    </div>
                </div>
            </div>

            {children}
            <Footer />
        </div >
    )
}


const StatItem = ({ value, label, valueColor, className }: {
    value: string;
    label: string;
    valueColor: string;
    className?: string;
}) => (
    <div className={`text-center ${className}`}>
        <span className={`font-semibold text-2xl lg:text-4xl block ${valueColor}`}>{value}</span>
        <p className="text-sm sm:text-base">{label}</p>
    </div>
);

export default layout;
