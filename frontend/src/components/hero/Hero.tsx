import { Button } from "../ui/button";

const Hero = () => {
    return (
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
            <section className=" h-[478px] w-full bg-cover bg-center bg-no-repeat sm:h-[500px] lg:h-[630px] bg-[url('https://res.cloudinary.com/cross-border-education-technologies-pte-ltd/image/upload/v1721890721/Shikho%20Website%20V3/Shikho%20New%20Hero%20Image%20-%20July%202024/mobile_responsive_punqka.png')] lg:bg-[url('https://res.cloudinary.com/cross-border-education-technologies-pte-ltd/image/upload/v1721890721/Shikho%20Website%20V3/Shikho%20New%20Hero%20Image%20-%20July%202024/desktop_version_sn7dpn.png')]">
                <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:h-full lg:px-8">
                    <div className="grid w-full grid-cols-12 lg:h-full ">
                        <div className=" col-span-12  md:col-span-7 md:pt-[90px] lg:pt-[120px]">
                            <h1 className="mb-4 text-6xl font-bold text-blue-800 ">
                                একাডেমিক থেকে এডমিশন
                            </h1>
                            <p className="mb-6 text-4xl text-pink-600 ">
                                প্রস্তুতি নাও দেশ সেরা শিক্ষক ও প্রযুক্তির সাথে
                            </p>
                            <div className="grid items-center gap-[20px] pt-[32px] md:flex">
                                <Button variant="default" className="bg-pink-500 hover:bg-pink-600">একাডেমিক প্রোগ্রাম দেখো</Button>
                                <Button variant="outline" className="text-pink-500 border-pink-500 hover:bg-pink-500 hover:text-white">শিখতে শুরু করো</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Hero;
