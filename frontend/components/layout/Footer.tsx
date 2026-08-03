export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black py-16">

      <div className="mx-auto grid max-w-7xl gap-10 px-6 md:grid-cols-4">

        <div>
          <h2 className="text-3xl font-bold text-[#D4AF37]">
            MAA FRAGORA
          </h2>

          <p className="mt-4 text-gray-400">
            Luxury Within Reach.
          </p>
        </div>

        <div>
          <h3 className="mb-5 font-semibold">
            Shop
          </h3>

          <ul className="space-y-3 text-gray-400">
            <li>Men</li>
            <li>Women</li>
            <li>Unisex</li>
            <li>Gift Sets</li>
          </ul>
        </div>

        <div>
          <h3 className="mb-5 font-semibold">
            Company
          </h3>

          <ul className="space-y-3 text-gray-400">
            <li>About</li>
            <li>Contact</li>
            <li>Privacy Policy</li>
            <li>Terms</li>
          </ul>
        </div>

        <div>
          <h3 className="mb-5 font-semibold">
            Contact
          </h3>

          <ul className="space-y-3 text-gray-400">
            <li>support@maafragora.com</li>
            <li>+91 XXXXX XXXXX</li>
            <li>India</li>
          </ul>
        </div>

      </div>

      <div className="mt-10 border-t border-white/10 pt-6 text-center text-gray-500">
        © 2026 MAA Fragora. All Rights Reserved.
      </div>

    </footer>
  );
}