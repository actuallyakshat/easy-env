import { SignIn } from "@clerk/nextjs";

export default function Login() {
  return (
    <div className="-mt-16 h-screen flex items-center justify-center">
      <SignIn />
    </div>
  );
}
