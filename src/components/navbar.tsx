import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { LoginLink, RegisterLink } from "@kinde-oss/kinde-auth-nextjs/server";
import { ArrowRight } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="sticky inset-x-0 top-0 z-30 h-14 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all">
      <MaxWidthWrapper>
        <div className="flex h-14 items-center justify-between border-b border-zinc-200">
          <Link href="/" className="z-40 flex font-semibold">
            quilly.
          </Link>

          {/* TODO: Mobile navbar */}

          <div className="hidden items-center space-x-4 sm:flex">
            <>
              <Link
                href="/pricing"
                className={buttonVariants({
                  size: "sm",
                  variant: "ghost",
                })}
              >
                Pricing
              </Link>
              <LoginLink
                className={buttonVariants({
                  size: "sm",
                  variant: "ghost",
                })}
              >
                Login
              </LoginLink>
              <RegisterLink
                className={buttonVariants({
                  size: "sm",
                })}
              >
                Get Started <ArrowRight className="ml-1.5 size-4" />
              </RegisterLink>
            </>
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  );
}
