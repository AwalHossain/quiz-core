/* eslint-disable react/jsx-no-undef */
/* eslint-disable @typescript-eslint/no-explicit-any */
import FacebookIcon from '@/assets/icons/Facebook.svg';
import Image from 'next/image';
import { z } from 'zod';

const loginSchema = z.object({
    phone: z.string().length(11, "Phone number must be 11 digits")
})

interface LoginFormProps {
    onForgotPassword: () => void
}

const LoginForm: React.FC<LoginFormProps> = ({ onForgotPassword }) => {
    // console.log(dictionary.registration, "dictionary");



    const handleSubmit = (data: z.infer<typeof loginSchema>) => {
        console.log(data, "data from login form");
        onForgotPassword()
    }


    const handleFacebookLogin = () => {
        console.log("Facebook login");
    }

    return (
        <div className="w-full">
            <div className="flex flex-col items-center mb-2 rounded-2xl sm:rounded-3xl gap-2 sm:gap-3">
                <div className="text-custom-content-primary text-center text-xl sm:text-heading-small">Login to your Account</div>
                <div className="text-custom-content-secondary text-sm sm:text-body-17 text-center">
                    It's quick and easy
                </div>
            </div>
            <div className="flex flex-col gap-4 w-full max-w-full sm:max-w-md mx-auto">

                <button
                    onClick={handleFacebookLogin}
                    className="flex items-center justify-center gap-2 w-full py-3 sm:py-3 px-2 sm:px-3 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors">
                    <Image src={FacebookIcon} alt="Facebook" width={20} height={20} className="w-5 h-5 sm:w-6 sm:h-6" />
                    <span className="text-gray-700 font-medium text-sm sm:text-base">ফেসবুক দিয়ে অ্যাকাউন্ট তৈরি করুন</span>
                </button>
            </div>
            {/* A bar between a word call "OR" */}
            <div className="flex items-center gap-2 my-2">
                <div className="flex-grow h-[1px] bg-custom-border-gray-light"></div>
                <span className="text-custom-content-secondary text-body-17 px-2">OR</span>
                <div className="flex-grow h-[1px] bg-custom-border-gray-light"></div>
            </div>
        </div>
    )
}

export default LoginForm
