import { NavLink } from "react-router-dom";

const FoodCard = ({ food }) => {
    const {
        _id,
        food_name,
        food_image,
        food_quantity,
        pickup_location,
        expiry_date_time,
        expired_date_time,
        additional_notes,
        food_status,
    } = food;

    return (
        <div className="dark:bg-gray-800 dark:text-white card card-compact bg-base-100 w-full max-w-sm md:max-w-md lg:max-w-lg shadow-xl mx-auto">
            <figure>
                <img
                    src={food_image}
                    className="h-[200px] w-full object-cover"
                    alt={food_name}
                />
            </figure>
            <div className="card-body">
                <h2 className="card-title text-lg md:text-xl">{food_name}</h2>
                <h2 className="text-sm md:text-base">
                    <span className="font-semibold">Quantity:</span> {food_quantity}
                </h2>
                <h2 className="text-sm md:text-base">
                    <span className="font-semibold">Pickup Location:</span> {pickup_location}
                </h2>
                <h2 className="text-sm md:text-base">
                    <span className="font-semibold">Expiry Date:</span>{" "}
                    {expiry_date_time || expired_date_time}
                </h2>
                <h2 className="text-sm md:text-base">
                    <span className="font-semibold">Note:</span> {additional_notes || "N/A"}
                </h2>
                <h2 className="text-sm md:text-base">
                    <span className="font-semibold">Food Status:</span> {food_status || "Available"}
                </h2>
                <div className="card-actions mt-4">
                    <NavLink to={`/foods/${_id}`} className="btn border-none bg-orange-400 text-white w-full md:w-auto">
                        View details
                    </NavLink>
                </div>
            </div>
        </div>
    );
};

export default FoodCard;