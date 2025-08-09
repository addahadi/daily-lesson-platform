import { SignUp } from "@clerk/clerk-react";

const SignUpPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-[#FF9500] to-orange-600 flex items-center justify-center px-4">
      <div className="bg-white shadow-2xl rounded-2xl p-10 w-full max-w-xl flex flex-col items-center">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          Join Daily Coding Lessons
        </h1>
        <SignUp
          appearance={{
            elements: {
              card: "shadow-none",
              formButtonPrimary:
                "bg-[#FF9500] hover:bg-orange-600 text-white font-semibold",
              headerTitle: "text-xl font-bold text-gray-800",
              footerActionLink: "text-[#FF9500] hover:text-orange-600",
            },
          }}
        />
      </div>
    </div>
  );
};

export default SignUpPage;
