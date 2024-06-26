import { useLocation, useNavigate } from "react-router-dom";

import { formatDate, postData } from "../../utils";
import NavBar from "../components/Navbar";
import PhotoCarousel from "../components/PhotoCarousel";
import { Category } from "../constants";

const AdView = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const ad = location.state;

    if (!ad) {
        // Handle the case where ad is null or undefined
        console.error("Ad details are missing.");
        // Optionally, navigate back to a default page or show an error message
        navigate("/"); // Redirect to home page or an error page
        return null; // Prevent further rendering
    }

    // Add more checks as necessary for ad properties
    const requiredProperties = [
        "title",
        "price",
        "content",
        "images",
        "user",
        "date",
        "modified",
        "category",
        "item",
    ];
    const missingProperties = requiredProperties.filter(
        (prop) => !(prop in ad)
    );

    if (missingProperties.length > 0) {
        console.error("Missing ad properties:", missingProperties.join(", "));
        navigate("/"); // Redirect or handle as needed
        return null; // Prevent further rendering
    }

    // Ensure that ad.category is valid
    if (!(ad.category in Category)) {
        console.error("Invalid category:", ad.category);
        navigate("/"); // Redirect or handle as needed
        return null; // Prevent further rendering
    }

    const handleSendMessage = async (e) => {
        e.preventDefault();

        try {
            // for now, start conversation with hardcoded "Hello!"
            // this should be changed
            await postData(
                "/api/messages",
                {
                    ad_id: ad.id,
                    message: "Hello!",
                },
                { Authorization: `Token ${localStorage.getItem("token")}` }
            );

            // navigate to the messages page (this new convo will be opened)
            navigate("/messages");
        } catch (error) {
            console.error("Failed to send message:", error);
        }
    };
    return (
        <section>
            <NavBar />
            <div className="flex justify-center my-10">
                <div className="card w-[70rem] bg-base-200 shadow-xl">
                    <div className="card-body">
                        <h2 className="text-3xl font-bold mb-5">{ad.title}</h2>
                        <p className="text-2xl font-semibold text-primary mb-5">
                            {`$${ad.price}`}
                        </p>
                        <p>{ad.content}</p>

                        <PhotoCarousel images={ad.images} />
                        <button
                            className="btn btn-primary btn-sm"
                            onClick={handleSendMessage}
                        >
                            Send message to {ad.user.username}
                        </button>
                        <p>Posted: {formatDate(ad.date)}</p>
                        <p>Modified: {formatDate(ad.modified)}</p>
                        <p>Category: {Category[ad.category]}</p>
                        <p>Seller: {ad.user.username}</p>
                        <p>Item: {ad.item}</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AdView;
