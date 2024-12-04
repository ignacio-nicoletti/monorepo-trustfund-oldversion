import { ReactNode } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";

//@ts-ignore
import CloseIcon from "../../../assets/icons/CloseIcon.svg"

interface Props {
  children?: ReactNode
  isOTP: boolean
  showModalText: string
  showModalStyles: string
  title: string
  titleStyles?: string 
  text: string
  closeBtn?: boolean,
  closeBtnStyles?: string,
  btnConfirmText: string
  btnRejectText: string
  btnConfirmStyles: string
  btnRejectStyles: string
  onSubmit?: (e: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>) => void
}

export default function Modal({children = null, isOTP = false, showModalText, showModalStyles, title, titleStyles = "", text, closeBtn = false, closeBtnStyles, btnConfirmText, btnConfirmStyles, btnRejectText, btnRejectStyles, onSubmit}: Props) {
  return (
    <AlertDialog defaultOpen={isOTP}>
      {!isOTP && <AlertDialogTrigger className={showModalStyles} >{showModalText}</AlertDialogTrigger>}
      <AlertDialogContent className="gap-8">
      {closeBtn && <AlertDialogCancel className={closeBtnStyles}>
        <img src={CloseIcon.src} alt="Close icon not found" />
        </AlertDialogCancel>}
        {title ? <AlertDialogHeader>
          <AlertDialogTitle className={titleStyles}>{title}</AlertDialogTitle>
          <AlertDialogDescription className="text-foreground">
            {text}
          </AlertDialogDescription>
        </AlertDialogHeader> : null}
        {children}
        <AlertDialogFooter className={`${!isOTP ? "items-center sm:justify-center" : ""}`}>
          {btnRejectText?.length > 0 && <AlertDialogCancel className={btnRejectStyles}>{btnRejectText}</AlertDialogCancel>}
          {btnConfirmText?.length > 0 && <AlertDialogAction className={btnConfirmStyles} onClick={onSubmit}>{btnConfirmText}</AlertDialogAction>}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
