import { signInAction } from "@/actions/users-actions";
import { LoginForm } from "@/components/login-form";

const Page = async () => {
  return <LoginForm submitForm={signInAction} />;
};

export default Page;
