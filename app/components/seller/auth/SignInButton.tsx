import Link from "next/link";

export default function SignInButton() {
    return (
        <Link
            href="/signin"
            // hover:text-blue-800 hover:bg-blue-100 px-3 
            // py-2 bg-blue-50 rounded-lg"
            className="px-4 py-2 bg-blue-50 text-black 
            rounded-lg shadow-md hover:bg-blue-100 text-sm
            focus:outline-none focus:ring-2 focus:ring-blue-400 
            focus:ring-opacity-75"
        >
            Seller portal
        </Link>
    )
}
