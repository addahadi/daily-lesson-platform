import Activities from "@/students/components/Home/Activities";
import ContinueLearning from "@/students/components/Home/ContinueLearning";
import Welcom from "@/students/components/Home/Welcom";


const Home = () => {
  
  return (
    <div className=" py-5 px-5">
      <Welcom />
      <Activities />
      <ContinueLearning />
    </div>
  );
};

export default Home;
