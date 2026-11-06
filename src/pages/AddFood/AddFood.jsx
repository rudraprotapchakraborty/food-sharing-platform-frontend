import { useContext, useState } from "react";
import AuthContext from "../../context/AuthContext/AuthContext";
import { toast } from "react-toastify"; // Import toast
import "react-toastify/dist/ReactToastify.css"; // Import Toastify CSS

const AddFood = () => {
    const { user } = useContext(AuthContext); // Get logged-in user
    const [foodName, setFoodName] = useState('');
    const [foodImageUrl, setFoodImageUrl] = useState(''); // Change to URL
    const [foodQuantity, setFoodQuantity] = useState('');
    const [pickupLocation, setPickupLocation] = useState('');
    const [expiredDate, setExpiredDate] = useState('');
    const [additionalNotes, setAdditionalNotes] = useState('');
    const [foodStatus, setFoodStatus] = useState('available');

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Prepare the food data object
        const foodData = {
            food_name: foodName,
            food_image_url: foodImageUrl, // Use image URL
            food_quantity: foodQuantity,
            pickup_location: pickupLocation,
            expiry_date_time: expiredDate,
            additional_notes: additionalNotes,
            food_status: foodStatus,
            donator: {
                name: user?.name,
                email: user?.email,
                image: user?.image,
            },
        };

        try {
            // Post the data to the backend API
            const response = await fetch("https://food-sharing-server-theta.vercel.app/foods", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(foodData),
            });

            const response2 = await fetch("https://food-sharing-server-theta.vercel.app/addedFoods", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(foodData),
            });

            const result = await response.json();
            if (result.success) {
                toast.success("Food added successfully!");
                // Reset form after successful submission
                setFoodName('');
                setFoodImageUrl('');
                setFoodQuantity('');
                setPickupLocation('');
                setExpiredDate('');
                setAdditionalNotes('');
                setFoodStatus('available');
            } else {
                toast.error(result.message || "Failed to add food!");
            }

            const result2 = await response2.json();
            if (result2.success) {
                setFoodName('');
                setFoodImageUrl('');
                setFoodQuantity('');
                setPickupLocation('');
                setExpiredDate('');
                setAdditionalNotes('');
                setFoodStatus('available');
            }

        } catch (error) {
            console.error("Error adding food:", error);
            toast.error("Failed to add food. Please try again.");
        }
    };

    return (
        <div className="max-w-screen-md mx-auto my-16 px-4 dark:text-white">
            <div className="dark:bg-gray-800 card bg-base-100 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title">Add Food</h2>

                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            {/* Food Name */}
                            <div>
                                <label className="block">Food Name</label>
                                <input
                                    type="text"
                                    className="input input-bordered w-full dark:bg-gray-700 dark:text-white"
                                    value={foodName}
                                    onChange={(e) => setFoodName(e.target.value)}
                                    required
                                />
                            </div>

                            {/* Food Image URL */}
                            <div>
                                <label className="block">Food Image URL</label>
                                <input
                                    type="url"
                                    className="input input-bordered w-full dark:bg-gray-700 dark:text-white"
                                    value={foodImageUrl}
                                    onChange={(e) => setFoodImageUrl(e.target.value)}
                                    placeholder="Enter image URL"
                                    required
                                />
                            </div>

                            {/* Food Quantity */}
                            <div>
                                <label className="block">Food Quantity</label>
                                <input
                                    type="number"
                                    className="input input-bordered w-full dark:bg-gray-700 dark:text-white"
                                    value={foodQuantity}
                                    onChange={(e) => setFoodQuantity(e.target.value)}
                                    required
                                />
                            </div>

                            {/* Pickup Location */}
                            <div>
                                <label className="block">Pickup Location</label>
                                <input
                                    type="text"
                                    className="input input-bordered w-full dark:bg-gray-700 dark:text-white"
                                    value={pickupLocation}
                                    onChange={(e) => setPickupLocation(e.target.value)}
                                    required
                                />
                            </div>

                            {/* Expiry Date/Time */}
                            <div>
                                <label className="block">Expired Date/Time</label>
                                <input
                                    type="datetime-local"
                                    className="input input-bordered w-full dark:bg-gray-700 dark:text-white"
                                    value={expiredDate}
                                    onChange={(e) => setExpiredDate(e.target.value)}
                                    required
                                />
                            </div>

                            {/* Additional Notes */}
                            <div>
                                <label className="block">Additional Notes</label>
                                <textarea
                                    className="textarea textarea-bordered w-full dark:bg-gray-700 dark:text-white"
                                    value={additionalNotes}
                                    onChange={(e) => setAdditionalNotes(e.target.value)}
                                />
                            </div>

                            <div className="mt-4">
                                <button
                                    type="submit"
                                    className="btn text-white border-none bg-orange-400 w-full rounded-3xl dark:bg-orange-600"
                                >
                                    Add Food
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddFood;
