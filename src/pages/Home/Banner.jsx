import { motion } from "framer-motion";
import photo1 from "../../assets/burger.png";
import photo2 from "../../assets/points.png";
import photo3 from "../../assets/text-bg.png";
import photo4 from "../../assets/list.png";
import { Link } from "react-router-dom";

const Banner = () => {
  return (
    <div className="hero bg-[#eaa848] min-h-96">
      <div className="hero-content flex-col lg:flex-row">
        <div className="flex-1 pl-4 lg:pl-24 pb-4 lg:pb-24">
          <motion.img
            src={photo1}
            animate={{ y: [50, 100, 50] }}
            transition={{
              duration: 10,
              ease: "easeOut",
              repeat: Infinity,
              repeatType: "reverse",
            }}
            className="max-w-sm w-72 rounded-t-[40px] rounded-br-[40px]"
          />
          <motion.img
            src={photo2}
            animate={{ x: [100, 150, 100] }}
            transition={{
              duration: 15,
              ease: "easeOut",
              repeat: Infinity,
              repeatType: "reverse",
            }}
            className="max-w-sm w-72 rounded-t-[40px] rounded-br-[40px] mt-4 lg:mt-0"
          />
        </div>
        <div className="flex-1 mr-4 lg:mr-24 mb-4 lg:mb-24 mt-4 lg:mt-12">
          <motion.h1 className="text-4xl lg:text-7xl font-extrabold text-white">
            Your Favorite
            <motion.span
              className="w-[300px]"
              animate={{ color: ["#cd862a", "#4b311c"] }}
              transition={{
                duration: 3,
                delay: 0.1,
                ease: "easeOut",
                repeat: Infinity,
                repeatType: "reverse",
              }}
              style={{
                backgroundImage: `url(${photo3})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                display: "inline-block",
              }}
            >
              Foods
            </motion.span>{" "}
            for you!
          </motion.h1>
          <div className="flex gap-4 items-center mt-8">
            <img src={photo4} className="w-[20px] h-[20px]" alt="" />
            <p className="text-lg lg:text-xl font-bold text-white">
              Fresh vegetables used.
            </p>
          </div>
          <div className="flex gap-4 items-center mt-2">
            <img src={photo4} className="w-[20px] h-[20px]" alt="" />
            <p className="text-lg lg:text-xl font-bold text-white">
              Fresh meats used.
            </p>
          </div>
          <div className="flex gap-4 items-center mt-2">
            <img src={photo4} className="w-[20px] h-[20px]" alt="" />
            <p className="text-lg lg:text-xl font-bold text-white">
              High quality ingredients.
            </p>
          </div>
          <Link to="/available-foods">
            <button className="btn w-full lg:w-[180px] bg-transparent text-white mt-6 rounded-full">
              I WANT FOOD
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Banner;
