import Banner from "./Banner";
import FeaturedFoods from "./FeaturedFoods";

const Home = () => {
    return (
        <div className="overflow-hidden">
            <Banner></Banner>
            <FeaturedFoods></FeaturedFoods>
        </div>
    );
};

export default Home;