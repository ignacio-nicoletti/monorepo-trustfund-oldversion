import { Metadata } from 'next';
import ForgotPasswordForm from '~/src/components/forms/ForgotPasswordForm/ForgotPasswordForm';

export const metadata: Metadata = {
  title: 'Forgot password',
  description: 'Cambio de contraseña de usuario',
}

type Props = {
  searchParams?: { [key: string]: string | undefined };
};

function Page(props: Props) {
  const {searchParams} = props
  

  return (
    <main>
      <ForgotPasswordForm otpParams={searchParams}/>
    </main>
  )
}

export default Page;
