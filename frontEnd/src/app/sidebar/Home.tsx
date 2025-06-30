import Activities from "@/components/component/Home/Activities";
import ContinueLearning from "@/components/component/Home/ContinueLearning";
import Welcom from "@/components/component/Home/Welcom";


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
