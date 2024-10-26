/* eslint-disable react/jsx-no-undef */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { setAuthToken } from '@/action/set-cookie';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getAxiosError } from '@/lib/getAxiosError';
import { SignUp } from '@/services/auth';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';



interface RegistrationFormProps {
    onLogin: () => void;
    onClose: () => void;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ onLogin, onClose }) => {
    const router = useRouter();

    const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const username = formData.get('username') as string;
        const password = formData.get('password') as string;
        console.log(username, "data from login form");
        try {
            const response = await SignUp(username, password);
            if (response && response.access_token) {
                await setAuthToken('access_token', response.access_token);
                console.log(response.access_token, "response from login form");
                toast.success('Account created successfully!');
                window.location.href = "/home";
            } else {
                throw new Error('Invalid response from server');
            }
        } catch (error: any) {
            console.error('Error starting or resuming exam session: ', error.response);
            if (error instanceof AxiosError) {
                const err = getAxiosError(error);
                toast.error(`${err.message}, ${err.status}`);
            }
        }
        onClose();
        router.push('/home');
    }


    return (
        <div className="w-full">
            <div className="flex flex-col items-center my-6 rounded-2xl sm:rounded-3xl gap-2 sm:gap-3">
                <div className="text-custom-content-primary text-center text-xl sm:text-heading-small">অ্যাকাউন্ট তৈরি করুন</div>
                <div className="text-custom-content-secondary text-sm sm:text-body-17 text-center">
                    অ্যাকাউন্ট তৈরি করার জন্য আপনার ইউজারনেম এবং পাসওয়ার্ড দিন
                </div>
            </div>
            <div className="flex flex-col gap-4 w-full max-w-full sm:max-w-md mx-auto">

                {/* <button
                    onClick={handleFacebookLogin}
                    className="flex items-center justify-center gap-2 w-full py-3 sm:py-3 px-2 sm:px-3 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors">
                    <Image src={FacebookIcon} alt="Facebook" width={20} height={20} className="w-5 h-5 sm:w-6 sm:h-6" />
                    <span className="text-gray-700 font-medium text-sm sm:text-base">ফেসবুক দিয়ে অ্যাকাউন্ট তৈরি করুন</span>
                </button> */}
                {/* Sign up with only username */}
                <form onSubmit={handleSignUp} className='flex flex-col gap-2 mb-4'>
                    <div className="flex flex-col gap-2 mb-4">
                        <div className='flex flex-col gap-2'>
                            <label htmlFor="username" className="text-custom-content-primary text-[14px] sm:text-[16px]">ইউজারনেম</label>
                            <Input type="text" name="username" placeholder="ইউজারনেম" className='text-custom-content-primary py-6 dark:text-custom-content-white rounded-xl' />
                        </div>
                        <div className='flex flex-col gap-2'>
                            <label htmlFor="password" className="text-custom-content-primary text-[14px] sm:text-[16px]">পাসওয়ার্ড</label>
                            <Input type="password" name="password" placeholder="পাসওয়ার্ড" className='text-custom-content-primary py-6 dark:text-custom-content-white rounded-xl' />
                        </div>
                    </div>
                    <Button
                        type="submit"
                        variant="default"
                        className="flex items-center justify-center gap-2 w-full py-3 sm:py-3 px-2 sm:px-3 rounded-lg shadow-sm transition-colors">
                        অ্যাকাউন্ট তৈরি করুন
                    </Button>
                </form>
                <div className="flex flex-col items-center justify-center">
                    <div className="w-full">
                        <div className="w-full h-[1px] bg-custom-border-gray-light"></div>
                        <p className="text-custom-content-secondary pt-3 text-sm sm:text-body-17 text-center">
                            আপনি আগেই অ্যাকাউন্ট আছেন? তাহলে <br />
                            <button onClick={onLogin} className="text-custom-green">লগইন করুন</button>
                        </p>
                    </div>
                </div>
            </div>
            {/* A bar between a word call "OR" */}
        </div >
    )
}

export default RegistrationForm
