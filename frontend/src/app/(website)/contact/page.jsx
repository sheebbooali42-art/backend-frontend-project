 export default function ContactPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-6">Contact Us</h1>

      <form className="max-w-lg space-y-4">
        <input
          type="text"
          placeholder="Your Name"
          className="w-full border p-3 rounded-lg"
        />

        <input
          type="email"
          placeholder="Your Email"
          className="w-full border p-3 rounded-lg"
        />

        <textarea
          rows="5"
          placeholder="Your Message"
          className="w-full border p-3 rounded-lg"
        />

        <button className="bg-black text-white px-6 py-3 rounded-lg">
          Send Message
        </button>
      </form>
    </div>
  );
}