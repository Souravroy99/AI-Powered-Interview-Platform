import { isAuthenticated } from "@/lib/actions/auth.action";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/LogoutButton.jsx";

const RootLayout = async ({ children }) => {
  const isUserAuthenticated = await isAuthenticated();

  if (!isUserAuthenticated) {
    redirect("/sign-in");
  }

  return (
    <div className="root-layout">
      <nav className="flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.svg"
            alt="Logo"
            width={27}
            height={30}
          />
          <h2 className="text-primary-100">MediChat</h2>
        </Link>

        {/* <LogoutButton /> */}
      </nav>

      {children}
    </div>
  );
};

export default RootLayout;