"use client"
import {
    Dialog,
    DialogContent
} from "@/components/ui/dialog";

interface AuthDialogProps {
    children: React.ReactNode;
    onOpenChange?: (open: boolean) => void;
    isOpen?: boolean;
    setIsOpen?: (open: boolean) => void;
}

const AuthDialog: React.FC<AuthDialogProps> = ({
    // title,
    // description,
    children,
    // footerText,
    // footerLinkText,
    // footerLinkHref,
    isOpen,
    onOpenChange
}) => {
    // const onOpenChange = (open: boolean) => {
    //     console.log(open, "open modal closing");
    //     setIsOpen && setIsOpen(open);
    // };

    return (
        <Dialog onOpenChange={onOpenChange} open={isOpen}>
            <DialogContent className="w-[90vw] max-w-[530px] border-2 border-custom-border-gray-light rounded-2xl sm:rounded-3xl px-0">
                <div className="p-4 sm:p-6 md:p-[1px_24px] gap-4 sm:gap-6">

                    {children}
                </div>

            </DialogContent>
        </Dialog>
    )
}

export default AuthDialog
