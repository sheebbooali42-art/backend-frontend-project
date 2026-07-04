 export default function AboutPage() {
  return (
    <section className="bg-gray-50 py-16">
      <div className="mx-auto max-w-7xl px-6">
        {/* Heading */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900">About NESTRO</h1>
          <p className="mt-4 text-lg text-gray-600">
            Creating beautiful homes with premium furniture and timeless
            designs.
          </p>
        </div>

        {/* About Section */}
        <div className="grid items-center gap-12 md:grid-cols-2">
          <img
            src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800"
            alt="Furniture"
            className="h-[450px] w-full rounded-xl object-cover shadow-lg"
          />

          <div>
            <h2 className="mb-4 text-3xl font-bold text-gray-900">
              Who We Are
            </h2>

            <p className="mb-4 text-gray-600">
              NESTRO is a modern furniture brand dedicated to bringing comfort,
              elegance, and functionality into every home. Our carefully
              selected collection is designed to match every lifestyle while
              maintaining exceptional quality.
            </p>

            <p className="text-gray-600">
              We believe that furniture is more than just decoration—it's a way
              to express your personality and create unforgettable memories with
              your loved ones.
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="mt-20 grid gap-8 md:grid-cols-3">
          <div className="rounded-xl bg-white p-8 shadow">
            <h3 className="mb-3 text-xl font-semibold">
              Premium Quality
            </h3>
            <p className="text-gray-600">
              Every product is crafted using high-quality materials for long
              lasting durability.
            </p>
          </div>

          <div className="rounded-xl bg-white p-8 shadow">
            <h3 className="mb-3 text-xl font-semibold">
              Modern Design
            </h3>
            <p className="text-gray-600">
              Stylish furniture collections designed for modern homes and
              contemporary living.
            </p>
          </div>

          <div className="rounded-xl bg-white p-8 shadow">
            <h3 className="mb-3 text-xl font-semibold">
              Customer First
            </h3>
            <p className="text-gray-600">
              Fast delivery, secure shopping, and dedicated customer support for
              every order.
            </p>
          </div>
        </div>

        {/* Statistics */}
        <div className="mt-20 grid gap-6 rounded-2xl bg-[#3a2418] p-10 text-center text-white md:grid-cols-4">
          <div>
            <h2 className="text-4xl font-bold">10K+</h2>
            <p>Happy Customers</p>
          </div>

          <div>
            <h2 className="text-4xl font-bold">500+</h2>
            <p>Furniture Products</p>
          </div>

          <div>
            <h2 className="text-4xl font-bold">25+</h2>
            <p>Expert Designers</p>
          </div>

          <div>
            <h2 className="text-4xl font-bold">4.9★</h2>
            <p>Customer Rating</p>
          </div>
        </div>

        {/* Mission */}
        <div className="mt-20 rounded-2xl bg-white p-10 shadow">
          <h2 className="mb-4 text-3xl font-bold text-center">
            Our Mission
          </h2>

          <p className="mx-auto max-w-3xl text-center text-gray-600">
            Our mission is to make premium furniture accessible to everyone by
            combining quality craftsmanship, elegant design, affordable pricing,
            and outstanding customer service. We strive to transform every house
            into a warm and comfortable home.
          </p>
        </div>
      </div>
    </section>
  );
}