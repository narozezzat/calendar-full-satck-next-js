import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default function HomePage() {
  const { userId } = auth();
  if (userId != null) redirect("/events");

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="w-full mx-4 lg:mx-0 lg:w-1/3">
        <div className="text-center mt-4">
          <h1 className="text-3xl font-semibold">Login in</h1>
          <p className="text-gray-400 text-sm">Welcome to Evently!</p>
        </div>
        <div className="flex px-4 py-8 flex-col gap-4">
          <Button asChild>
            <SignInButton />
          </Button>
          <Button asChild>
            <SignUpButton />
          </Button>
        </div>
      </Card>
    </div>
  );
}