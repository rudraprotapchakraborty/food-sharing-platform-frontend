import { useEffect, useState } from "react";

const MyFoodRequest = () => {
  const [foodRequests, setFoodRequests] = useState([]);

  useEffect(() => {
    fetch("https://food-sharing-server-theta.vercel.app/requestedFoods") // Fetch food requests
      .then((res) => res.json())
      .then((data) => setFoodRequests(data))
      .catch((error) => console.error("Error fetching food requests:", error));
  }, []);

  return (
    <div className="my-16 max-w-7xl mx-auto px-4">
      <h1 className="text-3xl md:text-5xl font-bold mb-8 text-center dark:text-white">My Food Requests</h1>

      {foodRequests.length === 0 ? (
        <p className="text-center text-gray-600">No food requests found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table-auto w-full text-left border-collapse border border-gray-400">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2 text-sm md:text-base">Food Name</th>
                <th className="border border-gray-300 px-4 py-2 text-sm md:text-base">Donator Name</th>
                <th className="border border-gray-300 px-4 py-2 text-sm md:text-base">
                  Pickup Location
                </th>
                <th className="border border-gray-300 px-4 py-2 text-sm md:text-base">Expiry Date</th>
                <th className="border border-gray-300 px-4 py-2 text-sm md:text-base">Request Date</th>
                <th className="border border-gray-300 px-4 py-2 text-sm md:text-base">
                  Additional Notes
                </th>
              </tr>
            </thead>
            <tbody>
              {foodRequests.map((request) => (
                <tr key={request._id} className="dark:text-white">
                  <td className="border border-gray-300 px-4 py-2 text-sm md:text-base">
                    {request.food_name}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-sm md:text-base">
                    {request.donator_name}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-sm md:text-base">
                    {request.pickup_location}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-sm md:text-base">
                    {new Date(request.expiry_date_time).toLocaleDateString()}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-sm md:text-base">
                    {new Date(request.request_date).toLocaleDateString()}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-sm md:text-base">
                    {request.additional_notes}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyFoodRequest;
