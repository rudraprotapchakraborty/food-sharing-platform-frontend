import { useEffect, useState } from "react";
import FoodCard from "./FoodCard";
import { NavLink } from "react-router-dom";

const FeaturedFoods = () => {
    const [foods, setFoods] = useState([]);

    useEffect(() => {
        fetch("https://food-sharing-server-theta.vercel.app/foods")
            .then((res) => res.json())
            .then((data) => {
                // Filter out foods that have been requested
                const availableFoods = data.filter(food => food.food_status !== "requested");

                // Sort by food_quantity in descending order
                const sortedFoods = availableFoods.sort((a, b) => b.food_quantity - a.food_quantity);

                // Select the top 6 items
                setFoods(sortedFoods.slice(0, 6));
            });
    }, []);

    return (
        <div className="my-16 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
            {/* Heading */}
            <h1 className="dark:text-white text-3xl sm:text-4xl md:text-5xl font-bold mb-10 text-center">
                Featured Foods
            </h1>

            {/* Food Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {foods.map((food) => (
                    <FoodCard key={food._id} food={food} />
                ))}
            </div>

            {/* Button */}
            <NavLink to="/available-foods" className="mt-12">
                <button className="w-full max-w-xs sm:w-[300px] rounded-3xl bg-orange-400 text-white py-3 px-6 text-lg font-medium">
                    Show All
                </button>
            </NavLink>
        </div>
    );
};

export default FeaturedFoods;
