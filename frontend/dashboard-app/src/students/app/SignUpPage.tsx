import { SignUp } from "@clerk/clerk-react";




const AnimatedShape = ({
  delay,
  duration,
  size,
  color,
  initialX,
  initialY,
} : {
  delay: number;
  duration: number;
  size: string;
  color: string;
  initialX: number;
  initialY: number;
}) => {
  const animationStyle = {
    animation: `float ${duration}s ease-in-out infinite`,
    animationDelay: `${delay}s`,
    left: `${initialX}%`,
    top: `${initialY}%`,
  };

  return (
    <div
      className={`absolute ${size} ${color} rounded-full opacity-20 animate-pulse`}
      style={animationStyle}
    />
  );
};
const SignUpPage = () => {
  return (
    <div className=" relative  bg-gray-50 flex justify-center  m-0">
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating Circles */}
        <AnimatedShape
          delay={0}
          duration={8}
          size="w-20 h-20"
          color="bg-orange-300"
          initialX={10}
          initialY={20}
        />
        <AnimatedShape
          delay={2}
          duration={10}
          size="w-16 h-16"
          color="bg-orange-400"
          initialX={80}
          initialY={15}
        />
        <AnimatedShape
          delay={4}
          duration={12}
          size="w-24 h-24"
          color="bg-orange-200"
          initialX={15}
          initialY={70}
        />
        <AnimatedShape
          delay={1}
          duration={9}
          size="w-12 h-12"
          color="bg-orange-500"
          initialX={75}
          initialY={80}
        />
        <AnimatedShape
          delay={3}
          duration={11}
          size="w-18 h-18"
          color="bg-orange-300"
          initialX={90}
          initialY={50}
        />
        <AnimatedShape
          delay={5}
          duration={7}
          size="w-14 h-14"
          color="bg-orange-400"
          initialX={5}
          initialY={45}
        />

        {/* Geometric Shapes */}
        <div
          className="absolute top-1/4 left-1/4 w-32 h-32 border-2 border-orange-200 rotate-45 animate-spin opacity-10"
          style={{ animationDuration: "20s" }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-24 h-24 border-2 border-orange-300 rotate-12 animate-bounce opacity-10"
          style={{ animationDuration: "3s" }}
        />

        {/* Gradient Orbs */}
        <div
          className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-orange-200 to-transparent rounded-full opacity-30 animate-pulse"
          style={{ animationDuration: "4s" }}
        />
        <div
          className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-orange-300 to-transparent rounded-full opacity-30 animate-pulse"
          style={{ animationDuration: "6s" }}
        />
      </div>
      <div className="w-full max-w-2xl p-10 z-10  bg-white flex flex-col items-center">
        <div className=" flex flex-col gap-4">
          <span className=" text-2xl text-gray-800 font-semibold text-center">
            Create Your Free Account
          </span>
          <span className=" text-gray-600 text-center">
            Join now and start your learning journey today!
          </span>
        </div>
        <div className=" w-full flex justify-center">
          <SignUp
            appearance={{
              elements: {
                cardBox: " border-none rounded-none shadow-none w-[500px]",

                card: "shadow-none w-[500px] ",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                formFieldInput: "border border-gray-300 rounded-md p-2",
                formButtonPrimary: "bg-orange-500 text-white rounded-md p-2",
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
