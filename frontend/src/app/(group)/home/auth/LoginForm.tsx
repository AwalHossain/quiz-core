/* eslint-disable react/jsx-no-undef */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { setAuthToken } from '@/action/set-cookie';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getAxiosError } from '@/lib/getAxiosError';
import { SignIn } from '@/services/auth';
import { AxiosError } from 'axios';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';


interface LoginFormProps {
    onRegistration: () => void
    onClose: () => void
}

const LoginForm: React.FC<LoginFormProps> = ({ onRegistration }) => {

    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        setIsLoading(true);
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const username = formData.get('username') as string;
        const password = formData.get('password') as string;
        try {
            const response = await SignIn(username, password);
            if (response && response.access_token) {
                await setAuthToken('access_token', response.access_token);
                toast.success('লগইন সফলভাবে সম্পন্ন হয়েছে!');
                window.location.href = "/home";
            } else {
                throw new Error('Invalid response from server');
            }
            setIsLoading(false);
        } catch (error: any) {
            console.error('Error starting or resuming exam session: ', error.response);
            if (error instanceof AxiosError) {
                const err = getAxiosError(error);
                toast.error(`${err.message}, ${err.status}`);
            }
            setIsLoading(false);
        }

    }


    return (
        <div className="w-full">
            <div className="flex flex-col items-center my-4 rounded-2xl sm:rounded-3xl gap-2 sm:gap-3">
                <div className="text-custom-content-primary text-center text-xl sm:text-heading-small">লগইন করুন</div>
                <div className="text-custom-content-secondary text-sm sm:text-body-17 text-center">
                    খুব সহজেই লগইন করুন এবং প্রশ্নগুলো উত্তর দিন
                </div>
            </div>
            <div className="flex flex-col gap-4 w-full max-w-full sm:max-w-md mx-auto">

 
                <form onSubmit={handleLogin} className='flex flex-col gap-2 mb-4'>
                    <div className="flex flex-col gap-2 mb-4">
                        <div className='flex flex-col gap-2'>
                            <label htmlFor="username" className="text-custom-content-primary text-[14px] sm:text-[16px]">ইউজারনেম</label>
                            <Input type="text" name="username" placeholder="ইউজারনেম" className='text-custom-content-primary py-6 rounded-xl' />
                        </div>
                        <div className='flex flex-col gap-2'>
                            <label htmlFor="password" className="text-custom-content-primary text-[14px] sm:text-[16px]">পাসওয়ার্ড</label>
                            <Input type="password" name="password" placeholder="পাসওয়ার্ড" className='text-custom-content-primary py-6 rounded-xl' />
                        </div>
                    </div>
                    <Button
                        type="submit"
                        variant="default"
                        className="flex items-center justify-center gap-2 w-full py-3 sm:py-3 px-2 sm:px-3 rounded-lg shadow-sm transition-colors"
                        disabled={isLoading}>
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "লগইন করুন"}
                    </Button>
                </form>
                <div className="flex flex-col items-center justify-center">
                    <div className="w-full">
                        <div className="w-full h-[1px] bg-custom-border-gray-light"></div>
                        <p className="text-custom-content-secondary pt-3 text-sm sm:text-body-17 text-center">
                            আপনি কোন অ্যাকাউন্ট নাই? তাহলে <br />
                            <button onClick={onRegistration} className="text-custom-green">অ্যাকাউন্ট তৈরি করুন</button>
                        </p>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default LoginForm
