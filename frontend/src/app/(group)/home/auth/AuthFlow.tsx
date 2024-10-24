"use client"

import { useState } from 'react'

import AuthDialog from '@/components/Auth/AuthDialog'
import { Button } from "@/components/ui/button"
import LoginForm from './LoginForm'





const AuthFlow: React.FC = () => {
    const [isLoginOpen, setIsLoginOpen] = useState(false)
    const [isResetOpen, setIsResetOpen] = useState(false)

    const openLoginModal = () => {
        setIsLoginOpen(true)
        setIsResetOpen(false)
    }

    const openResetModal = () => {
        setIsLoginOpen(false)
        setIsResetOpen(true)
    }


    return (
        <div>
            <Button onClick={openLoginModal}
                variant="outline"
                className="px-4 py-2 hover:bg-primary rounded-xl dark:text-custom-content-white border-primary hover:border-transparent dark:border-custom-content-white "
            >Login</Button>

            <AuthDialog
                isOpen={isLoginOpen}
                onOpenChange={setIsLoginOpen}
            >
                <LoginForm onForgotPassword={openResetModal} />
            </AuthDialog>


        </div>
    )
}

export default AuthFlow



// import { getDictionary } from "@/i18n/dictionary";
// import RegistrationPage from "./features/RegistrationPage";


// const Page = async () => {
//     const dictionary = await getDictionary();

//     // return <RegistrationPage dictionary={dictionary} />;


// };

// export default Page;
