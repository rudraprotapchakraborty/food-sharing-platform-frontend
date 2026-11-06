import { useEffect, useState } from "react";
import FoodCard from "../Home/FoodCard";

const AvailableFoods = () => {
    const [foods, setFoods] = useState([]);
    const [sortedFoods, setSortedFoods] = useState([]);
    const [sortOrder, setSortOrder] = useState("asc");
    const [gridLayout, setGridLayout] = useState(3);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetch("https://food-sharing-server-theta.vercel.app/foods")
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`Failed to fetch: ${res.statusText}`);
                }
                return res.json();
            })
            .then((data) => {
                setFoods(data);
                setSortedFoods(data);
            })
            .catch((error) => console.error("Error fetching data: ", error));
    }, []);

    const sortFoodsByExpireDate = (order) => {
        const sorted = [...foods].sort((a, b) => {
            const dateA = new Date(a.expiry_date_time);
            const dateB = new Date(b.expiry_date_time);
            return order === "asc" ? dateA - dateB : dateB - dateA;
        });
        setSortedFoods(sorted);
    };

    useEffect(() => {
        if (foods.length > 0) {
            sortFoodsByExpireDate(sortOrder);
        }
    }, [sortOrder, foods]);

    const removeFoodFromList = (foodId) => {
        setFoods((prevFoods) => prevFoods.filter((food) => food._id !== foodId));
    };

    const availableFoods = sortedFoods.filter(
        (food) => food.food_status !== "requested"
    );

    const filteredFoods = availableFoods.filter((food) => {
        const name = food.food_name || "";
        return name.toLowerCase().includes(searchQuery.toLowerCase());
    });

    const toggleGridLayout = () => {
        setGridLayout((prevLayout) => (prevLayout === 3 ? 2 : 3));
    };

    return (
        <div className="my-16 mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
            <h1 className="dark:text-white text-3xl sm:text-4xl lg:text-5xl font-bold mb-8 text-center">
                Available Foods
            </h1>

            <input
                type="text"
                placeholder="Search by Food Name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="focus:border-orange-600 focus:outline-none px-4 py-2 mb-6 rounded-3xl border border-orange-400 w-full sm:w-2/3 lg:w-1/3"
            />

            <div className="mb-8 flex flex-wrap justify-between items-center w-full gap-4">
                <div>
                    <button
                        onClick={() => setSortOrder("asc")}
                        className={`mr-2 px-4 py-2 rounded-3xl ${
                            sortOrder === "asc"
                                ? "bg-orange-400 text-white"
                                : "bg-white dark:bg-gray-800 border-orange-400 text-orange-400 border"
                        }`}
                    >
                        Sort Ascending
                    </button>
                    <button
                        onClick={() => setSortOrder("desc")}
                        className={`px-4 py-2 rounded-3xl ${
                            sortOrder === "desc"
                                ? "bg-orange-400 text-white"
                                : "bg-white dark:bg-gray-800 border-orange-400 text-orange-400 border"
                        }`}
                    >
                        Sort Descending
                    </button>
                </div>

                <button
                    onClick={toggleGridLayout}
                    className="px-4 py-2 rounded-3xl bg-orange-400 text-white"
                >
                    Toggle Layout
                </button>
            </div>

            {/* Responsive grid layout */}
            <div
                className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${gridLayout} gap-6 w-full`}
            >
                {filteredFoods.length > 0 ? (
                    filteredFoods.map((food) => (
                        <FoodCard
                            key={food._id}
                            food={food}
                            removeFood={removeFoodFromList}
                        />
                    ))
                ) : (
                    <p className="text-center w-full">No results found</p>
                )}
            </div>
        </div>
    );
};

export default AvailableFoods;
