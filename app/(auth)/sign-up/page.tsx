import { registerUser } from "@/actions/users-actions";
import { RegisterForm } from "@/components/register-form";

const Page = async () => {
  return <RegisterForm submitForm={registerUser} />;
};

export default Page;
