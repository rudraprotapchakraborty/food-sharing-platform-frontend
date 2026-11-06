import { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // To get the ID from the URL
import AuthContext from "../../context/AuthContext/AuthContext";
import { toast } from "react-toastify"; // Import toast
import "react-toastify/dist/ReactToastify.css"; // Import Toastify CSS

const FoodDetails = () => {
    const { user } = useContext(AuthContext);
    const { id } = useParams(); // Extract the ID from the URL
    const [food, setFood] = useState(null); // State to store the food data
    const [showModal, setShowModal] = useState(false);
    const [notes, setNotes] = useState("");
    const requestDate = new Date().toLocaleString();

    useEffect(() => {
        const fetchFoodData = async () => {
            try {
                const response = await fetch(
                    `https://food-sharing-server-theta.vercel.app/foods/${id}`
                );
                const data = await response.json();
                if (data) {
                    setFood(data); // Store the fetched food data in state
                } else {
                    toast.error("Food not found");
                }
            } catch (error) {
                console.error("Error fetching food data:", error);
                toast.error("Failed to load food details");
            }
        };

        fetchFoodData();
    }, [id]); // The hook depends on the `id` from the URL

    const handleRequest = async () => {
        const requestData = {
            food_id: food._id,
            food_name: food.food_name,
            food_image: food.food_image,
            pickup_location: food.pickup_location,
            expiry_date_time: food.expiry_date_time,
            donator_email: food.donator.email,
            donator_name: food.donator.name,
            user_email: user?.email, // Use logged-in user's email
            request_date: requestDate,
            additional_notes: notes,
        };

        try {
            const response = await fetch(
                `https://food-sharing-server-theta.vercel.app/foods/request/${food._id}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(requestData),
                }
            );

            const result = await response.json();
            if (result.success) {
                toast.success("Food successfully requested!");
                setShowModal(false);
            } else {
                toast.error("Food already requested!");
            }
        } catch (error) {
            console.error("Error requesting food:", error);
        }
    };

    // If food data is not yet loaded, show loading state
    if (!food) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    return (
        <div className="max-w-screen-md mx-auto my-16 px-4">
            <div className="card bg-base-100 dark:bg-gray-800 dark:text-white shadow-xl w-full">
                <figure>
                    <img src={food.food_image} className="w-full h-64 object-cover" alt="Food" />
                </figure>
                <div className="card-body">
                    <h2 className="card-title text-xl md:text-2xl font-bold">
                        {food.food_name}
                    </h2>
                    <p>
                        <span className="font-semibold">Quantity:</span>{" "}
                        {food.food_quantity}
                    </p>
                    <p>
                        <span className="font-semibold">Pickup Location:</span>{" "}
                        {food.pickup_location}
                    </p>
                    <p>
                        <span className="font-semibold">Expiry Date:</span>{" "}
                        {food.expiry_date_time}
                    </p>
                    <p>
                        <span className="font-semibold">Note:</span>{" "}
                        {food.additional_notes}
                    </p>
                    <p>
                        <span className="font-semibold">Food Status:</span>{" "}
                        {food.food_status}
                    </p>
                    <h3 className="font-semibold">Donator:</h3>
                    <div className="flex items-center gap-4">
                        <img
                            className="w-16 h-16 rounded-full"
                            src={food.donator.image}
                            alt="Donator"
                        />
                        <div>
                            <p>{food.donator.name}</p>
                            <p>{food.donator.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="mt-4 btn border-none bg-orange-400 text-white w-full sm:w-auto rounded-lg py-2 px-6"
                    >
                        Request
                    </button>
                </div>
            </div>

            {showModal && (
                <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50">
                    <div className="modal-box bg-white p-5 rounded-lg shadow-lg w-11/12 md:w-1/2">
                        <h3 className="font-bold text-lg mb-4">Request Food</h3>
                        <div className="space-y-3">
                            <p>
                                <strong>Food Name:</strong> {food.food_name}
                            </p>
                            <p>
                                <strong>Food Image:</strong>{" "}
                                <img
                                    src={food.food_image}
                                    className="w-20 h-20"
                                    alt="Food"
                                />
                            </p>
                            <p>
                                <strong>Food ID:</strong> {food._id}
                            </p>
                            <p>
                                <strong>Donator Name:</strong> {food.donator.name}
                            </p>
                            <p>
                                <strong>Donator Email:</strong> {food.donator.email}
                            </p>
                            <p>
                                <strong>User Email:</strong>{" "}
                                {user?.email || "Not logged in"}
                            </p>
                            <p>
                                <strong>Request Date:</strong> {requestDate}
                            </p>
                            <p>
                                <strong>Pickup Location:</strong>{" "}
                                {food.pickup_location}
                            </p>
                            <p>
                                <strong>Expiry Date:</strong>{" "}
                                {food.expiry_date_time}
                            </p>
                            <textarea
                                placeholder="Add additional notes (optional)"
                                className="textarea textarea-bordered w-full"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                            ></textarea>
                        </div>
                        <div className="modal-action mt-4 flex justify-end gap-2">
                            <button
                                onClick={() => setShowModal(false)}
                                className="btn bg-gray-300 text-black"
                            >
                                Close
                            </button>
                            <button
                                onClick={handleRequest}
                                className="btn bg-orange-400 text-white"
                            >
                                Request
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FoodDetails;
