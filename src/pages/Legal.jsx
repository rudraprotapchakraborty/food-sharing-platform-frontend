const pages = {
  privacy: {
    title: "Privacy Policy",
    updated: "November 2026",
    sections: [
      ["What we collect", "Your name, email address and, if you add one, a profile photo. If you sign in with Google we receive your name, email and profile picture from Google. We also store the food listings you share and the requests you send or receive."],
      ["How we use it", "To sign you in, show your listings, pass requests between donors and neighbours, send one-time codes to confirm your email and reset your password, and let people know who shared a listing. We do not sell your data and we do not show ads."],
      ["What is public", "Listings are public: the photo, description, servings, pickup place, collection deadline and the donor's name and photo. Browsing needs no account. Please give a public meeting place or an area as the pickup location, not your home address."],
      ["What stays private", "Your email address is hidden from other members. When a donor accepts a request, the donor and that one requester can see each other's email so they can arrange the handover. Requests you send are visible only to you and the donor."],
      ["Where it is stored", "Account, listing and request data is stored in a MongoDB database. Profile photos are hosted on an image service. Emails are sent through our mail provider."],
      ["Your choices", "You can change your name, photo, email and password in Account settings, and delete your account at any time. Deleting it removes your profile, your listings and your requests."],
      ["Cookies and storage", "We keep your sign-in token and your light or dark theme preference in your browser's local storage. There are no tracking or advertising cookies."],
      ["Photos", "Sample listing photos come from Wikipedia and Wikimedia Commons under their free licences. Photos you add are linked from where you host them."],
      ["Test accounts", "The shared test accounts on the sign-in page are public. Do not store anything private in them."],
    ],
  },
  terms: {
    title: "Terms of Use",
    updated: "November 2026",
    sections: [
      ["Using FoodShare", "FoodShare is a free personal project that helps people share surplus food. By creating an account or signing in you agree to these terms."],
      ["Food safety", "You share and collect food at your own risk. Donors should only offer food that is safe to eat, describe it honestly, including allergens, and keep it appropriately stored. Collectors should use their own judgement before eating anything."],
      ["Your account", "Keep your password safe. You are responsible for activity on your account. Tell us if you think someone else has access to it."],
      ["Listings and requests", "Only list food you own and are entitled to give away. Do not list anything unlawful, unsafe or misleading, and use requests for their purpose. You can edit or remove your own listings and cancel your own requests at any time."],
      ["Meeting people", "Arrange pickups in public places where you can, and take sensible care when meeting people. FoodShare is not responsible for what happens between members."],
      ["Moderation", "Administrators may remove listings or suspend accounts that break these terms."],
      ["Acceptable use", "Do not try to break, overload or gain unauthorised access to the service or to other people's data, and do not use automated tools to create accounts, listings or requests in bulk."],
      ["Test accounts", "Shared test accounts are provided for trying the platform. They are reset from time to time and some actions, such as changing settings or editing the sample listings, are disabled."],
      ["Availability", "The service is provided as is, with no guarantee that it will always be available or free of errors. Features may change or be removed."],
      ["Ending your account", "You can delete your account at any time in Account settings."],
      ["Changes", "We may update these terms. Continuing to use FoodShare after a change means you accept the new version."],
    ],
  },
};

export default function Legal({ page }) {
  const doc = pages[page];
  return (
    <article className="frame max-w-3xl py-14">
      <span className="eyeline">Legal</span>
      <h1 className="display mt-4 text-[clamp(34px,5vw,56px)]">{doc.title}</h1>
      <p className="mt-3 text-sm text-muted">Last updated {doc.updated}</p>
      <div className="mt-10 space-y-8">
        {doc.sections.map(([heading, text]) => (
          <section key={heading}>
            <h2 className="text-lg font-bold tracking-tight">{heading}</h2>
            <p className="mt-2 leading-relaxed text-muted">{text}</p>
          </section>
        ))}
      </div>
    </article>
  );
}
