import { useEffect, useState, useContext } from "react";
import AuthContext from "../../context/AuthContext/AuthContext";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ManageMyFoods = () => {
    const { user } = useContext(AuthContext);
    const [addedFood, setAddedFood] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedFood, setSelectedFood] = useState(null);

    useEffect(() => {
        if (user?.email) {
            fetch(`https://food-sharing-server-theta.vercel.app/addedFoods?email=${user.email}`)
                .then((res) => res.json())
                .then((data) => setAddedFood(data))
                .catch((error) => console.error("Error fetching food requests:", error));
        }
    }, [user?.email]);

    const handleUpdate = (food) => {
        setSelectedFood(food);
        setShowModal(true);
    };

    const handleDelete = (id) => {
        toast.info(
            <div>
                <span>Are you sure you want to delete this food?</span>
                <div className="mt-2">
                    <button
                        onClick={() => {
                            fetch(`https://food-sharing-server-theta.vercel.app/addedFoods?email=${user.email}&foodId=${id}`, {
                                method: "DELETE",
                            })
                                .then((res) => res.json())
                                .then((data) => {
                                    if (data.success) {
                                        setAddedFood(addedFood.filter((food) => food._id !== id));
                                        toast.success("Food deleted successfully!");
                                    }
                                })
                                .catch((error) => {
                                    console.error("Error deleting food:", error);
                                    toast.error("Error deleting food.");
                                });
                            toast.dismiss();
                        }}
                        className="bg-red-500 text-white px-4 py-2 rounded mr-2"
                    >
                        Yes
                    </button>
                    <button
                        onClick={() => toast.dismiss()}
                        className="bg-gray-500 text-white px-4 py-2 rounded"
                    >
                        No
                    </button>
                </div>
            </div>,
            {
                autoClose: false,
                closeOnClick: false,
                draggable: false,
                position: "top-center",
            }
        );
    };

    const handleUpdateSubmit = (e) => {
        e.preventDefault();
        if (selectedFood) {
            fetch(`https://food-sharing-server-theta.vercel.app/addedFoods?email=${user.email}&foodId=${selectedFood._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    food_name: selectedFood.food_name,
                    food_quantity: selectedFood.food_quantity,
                    pickup_location: selectedFood.pickup_location,
                    expiry_date_time: selectedFood.expiry_date_time,
                    additional_notes: selectedFood.additional_notes,
                }),
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.success) {
                        setAddedFood(
                            addedFood.map((food) =>
                                food._id === selectedFood._id ? selectedFood : food
                            )
                        );
                        setShowModal(false);
                    } else {
                        console.error("Failed to update food:", data.message);
                    }
                })
                .catch((error) => console.error("Error updating food:", error));
        }
    };

    return (
        <div className="my-16 max-w-5xl mx-auto px-4">
            <h1 className="text-4xl font-bold mb-8 text-center dark:text-white">Manage My Foods</h1>

            {addedFood.length === 0 ? (
                <p className="text-center text-gray-600">No food requests found.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="table-auto w-full text-left border-collapse border border-gray-400 text-center">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border border-gray-300 px-4 py-2 text-sm md:text-base">Food Name</th>
                                <th className="border border-gray-300 px-4 py-2 text-sm md:text-base">Quantity</th>
                                <th className="border border-gray-300 px-4 py-2 text-sm md:text-base">Pickup Location</th>
                                <th className="border border-gray-300 px-4 py-2 text-sm md:text-base">Expiry Date</th>
                                <th className="border border-gray-300 px-4 py-2 text-sm md:text-base">Additional Notes</th>
                                <th className="border border-gray-300 px-4 py-2 text-sm md:text-base">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {addedFood.map((add) => (
                                <tr key={add._id} className="dark:text-white">
                                    <td className="border border-gray-300 px-4 py-2 text-sm md:text-base">{add.food_name}</td>
                                    <td className="border border-gray-300 px-4 py-2 text-sm md:text-base">{add.food_quantity}</td>
                                    <td className="border border-gray-300 px-4 py-2 text-sm md:text-base">{add.pickup_location}</td>
                                    <td className="border border-gray-300 px-4 py-2 text-sm md:text-base">
                                        {new Date(add.expiry_date_time).toLocaleDateString()}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2 text-sm md:text-base">{add.additional_notes}</td>
                                    <td className="border border-gray-300 px-4 py-2 text-sm md:text-base flex flex-col lg:flex-row gap-2 justify-center">
                                        <button
                                            onClick={() => handleUpdate(add)}
                                            className="bg-green-400 text-white px-4 py-2 rounded"
                                        >
                                            Update
                                        </button>
                                        <button
                                            onClick={() => handleDelete(add._id)}
                                            className="bg-red-400 text-white px-4 py-2 rounded"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {showModal && (
                <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50">
                    <div className="modal-box bg-white p-5 rounded-lg shadow-lg w-11/12 md:w-1/2">
                        <h2 className="font-bold text-lg mb-4">Update Food</h2>
                        <form onSubmit={handleUpdateSubmit} className="grid grid-cols-1 gap-4">
                            <div>
                                <label className="block mb-2">Food Name</label>
                                <input
                                    type="text"
                                    value={selectedFood?.food_name || ""}
                                    onChange={(e) => setSelectedFood({ ...selectedFood, food_name: e.target.value })}
                                    className="border border-gray-300 px-4 py-2 w-full"
                                />
                            </div>
                            <div>
                                <label className="block mb-2">Quantity</label>
                                <input
                                    type="number"
                                    value={selectedFood?.food_quantity || ""}
                                    onChange={(e) =>
                                        setSelectedFood({ ...selectedFood, food_quantity: e.target.value })
                                    }
                                    className="border border-gray-300 px-4 py-2 w-full"
                                />
                            </div>
                            <div>
                                <label className="block mb-2">Pickup Location</label>
                                <input
                                    type="text"
                                    value={selectedFood?.pickup_location || ""}
                                    onChange={(e) =>
                                        setSelectedFood({ ...selectedFood, pickup_location: e.target.value })
                                    }
                                    className="border border-gray-300 px-4 py-2 w-full"
                                />
                            </div>
                            <div>
                                <label className="block mb-2">Expiry Date</label>
                                <input
                                    type="date"
                                    value={selectedFood?.expiry_date_time.slice(0, 10) || ""}
                                    onChange={(e) =>
                                        setSelectedFood({ ...selectedFood, expiry_date_time: e.target.value })
                                    }
                                    className="border border-gray-300 px-4 py-2 w-full"
                                />
                            </div>
                            <div>
                                <label className="block mb-2">Additional Notes</label>
                                <textarea
                                    value={selectedFood?.additional_notes || ""}
                                    onChange={(e) =>
                                        setSelectedFood({ ...selectedFood, additional_notes: e.target.value })
                                    }
                                    className="textarea textarea-bordered w-full"
                                />
                            </div>
                            <div className="flex justify-between">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="bg-gray-500 text-white px-4 py-2 rounded"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-green-400 text-white px-4 py-2 rounded"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageMyFoods;
