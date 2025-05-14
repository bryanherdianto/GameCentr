export default function Footer() {
    return (
        <footer className="bg-indigo-800 text-white py-6">
            <div className="container mx-auto px-4 text-center">
                <p>© {new Date().getFullYear()} NumbrHunt</p>
                <p className="text-sm text-indigo-200 mt-2">Play all of the games and show off your skills!</p>
            </div>
        </footer>
    )
}