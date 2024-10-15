export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-4 w-full fixed bottom-0 left-0">
      <div className="container mx-auto text-center">
        <p className="text-sm sm:text-base">
          &copy; {new Date().getFullYear()} Made by Bayu Psfx
        </p>
      </div>
    </footer>
  );
}
