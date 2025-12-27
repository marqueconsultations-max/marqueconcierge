import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Car, Upload, Phone, Mail, CheckCircle2, Shield, Calendar, Plus, MapPin } from "lucide-react";

// ✅ EDIT THESE
const BRAND = {
  name: "Marque Concierge & Consulting",
  tagline: "Premium rentals. Clean experience.",
  // Put your real contact info here
  businessEmail: "marqueconsultations@gmail.com",
  businessPhone: "(XXX) XXX-XXXX", // add your phone
  businessPhoneE164: "+1XXXXXXXXXX", // add your phone in +1 format // for SMS providers later
  // (Optional) add your Instagram
  instagram: "@marqueconcierge",
};

// IMPORTANT:
// This preview is front-end only. To actually receive uploads to email + text,
// connect the form to a backend endpoint (Vercel/Netlify function) and set SUBMIT_ENDPOINT.
const SUBMIT_ENDPOINT = "https://formspree.io/f/xpqzqlqo"; // e.g. "https://YOUR_DOMAIN.com/api/inquiry"

const FLEET = [
  {
    id: "audi-a3",
    name: "2017 Audi A3 S line",
    price: 185,
    priceUnit: "day",
    highlights: ["Sporty premium compact", "Great city cruiser", "S line styling"],
    image:
      "https://mediacloud.carbuyer.co.uk/image/private/s--O8p7P8sX--/f_auto%2Ct_primary-image-mobile%401/v1579628518/carbuyer/audi-a3-s-line.jpg",
  },
  {
    id: "tesla-y-ambient",
    name: "Tesla Model Y (Ambient Lighting)",
    price: 200,
    priceUnit: "day",
    highlights: ["Ambient lighting", "Modern interior", "Smooth EV drive"],
    image:
      "https://cdn.shopify.com/s/files/1/0196/5170/files/b45c2c0a-7df8-46a6-8111-282502653675.__CR0_0_970_600_PT0_SX970_V1_2048x2048.jpg?v=1653663433",
  },
  {
    id: "tesla-y-rwd",
    name: "Tesla Model Y RWD",
    price: 200,
    priceUnit: "day",
    highlights: ["Efficient range", "Spacious SUV", "Clean minimalist feel"],
    image:
      "https://images.carexpert.com.au/resize/960/-/cms/v1/media/2023-03-2023-tesla-model-y-rwd-32.jpg",
  },
  {
    id: "lexus-is300",
    name: "2024 Lexus IS 300",
    price: 200,
    priceUnit: "day",
    highlights: ["Luxury sport sedan", "Sharp styling", "Comfort + handling"],
    image:
      "https://platform.cstatic-images.com/xxlarge/in/v2/stock_photos/530fbfc6-e1bf-484a-8c55-2f1331dd3c28/db1c82bb-ff84-4743-9c7c-c9ff0fbecc89.png",
  },
];

const REQUIRED_DOCS = [
  "Driver License",
  "Proof of Insurance",
  "Selfie holding license (optional but recommended)",
];

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

function formatUSD(n) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

function Badge({ icon: Icon, children }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80">
      <Icon className="h-4 w-4 text-white/70" />
      {children}
    </span>
  );
}

function SectionTitle({ kicker, title, subtitle }) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      {kicker ? (
        <div className="mb-3 text-xs font-semibold tracking-widest text-white/60">
          {kicker}
        </div>
      ) : null}
      <h2 className="text-2xl font-semibold text-white sm:text-3xl">{title}</h2>
      {subtitle ? (
        <p className="mt-3 text-sm leading-6 text-white/70 sm:text-base">{subtitle}</p>
      ) : null}
    </div>
  );
}

function Card({ children, className }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/10 bg-gradient-to-b from-white/8 to-white/3 shadow-[0_20px_70px_-40px_rgba(0,0,0,0.8)]",
        className
      )}
    >
      {children}
    </div>
  );
}

export default function App() {
  const [selectedCar, setSelectedCar] = useState(FLEET[0].id);
  const [status, setStatus] = useState({ state: "idle", message: "" });
  const [files, setFiles] = useState([]);

  const selected = useMemo(
    () => FLEET.find((c) => c.id === selectedCar) ?? FLEET[0],
    [selectedCar]
  );

  async function handleSubmit(e) {
    e.preventDefault();

    const form = e.currentTarget;
    const fd = new FormData(form);
    files.forEach((f) => fd.append("documents", f));

    setStatus({ state: "sending", message: "Sending inquiry…" });

    try {
      if (!SUBMIT_ENDPOINT) {
        // Preview mode: simulate success
        await new Promise((r) => setTimeout(r, 700));
        setStatus({
          state: "success",
          message:
            "Preview mode: inquiry captured. Connect a backend endpoint to receive emails/texts + files.",
        });
        form.reset();
        setFiles([]);
        return;
      }

      const res = await fetch(SUBMIT_ENDPOINT, {
        method: "POST",
        body: fd,
        headers: {
          // Helps Formspree return JSON responses and improves compatibility
          Accept: "application/json",
        },
      });

      if (!res.ok) {
        const t = await res.text();
        throw new Error(t || "Request failed");
      }

      setStatus({ state: "success", message: "Inquiry sent! We’ll get back to you shortly." });
      form.reset();
      setFiles([]);
    } catch (err) {
      setStatus({
        state: "error",
        message:
          "Couldn’t send right now. Please call/text or email us. (If you’re previewing, add SUBMIT_ENDPOINT.)",
      });
      console.error(err);
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_45%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(255,255,255,0.06),transparent_40%)]" />
        <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(to_right,rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:48px_48px]" />
      </div>

      {/* Nav */}
      <header className="relative z-10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-white/5">
              <Car className="h-5 w-5 text-white/90" />
            </div>
            <div>
              <div className="text-sm font-semibold">{BRAND.name}</div>
              <div className="text-xs text-white/60">{BRAND.tagline}</div>
            </div>
          </div>

          <nav className="hidden items-center gap-6 text-sm text-white/70 sm:flex">
            <a className="hover:text-white" href="#fleet">
              Fleet
            </a>
            <a className="hover:text-white" href="#how-it-works">
              How it works
            </a>
            <a className="hover:text-white" href="#inquiry">
              Inquiry
            </a>
            <a className="hover:text-white" href="#faq">
              FAQ
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <a
              className="hidden rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 hover:bg-white/10 sm:inline-flex"
              href={`mailto:${BRAND.businessEmail}`}
            >
              <Mail className="mr-2 h-4 w-4" />
              Email
            </a>
            <a
              className="inline-flex rounded-full bg-white px-4 py-2 text-sm font-semibold text-black hover:opacity-90"
              href="#inquiry"
            >
              Book / Inquiry
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="relative z-10">
        <section className="mx-auto max-w-6xl px-4 pb-10 pt-6 sm:px-6 sm:pb-16 sm:pt-10">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-6">
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-3xl font-semibold leading-tight sm:text-5xl"
              >
                Reserve a premium ride in minutes.
              </motion.h1>
              <p className="mt-4 max-w-xl text-sm leading-6 text-white/70 sm:text-base">
                Select your vehicle, submit your dates, and upload the required documents.
                We’ll confirm availability and send next steps.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Badge icon={Shield}>Secure document upload</Badge>
                <Badge icon={Calendar}>Flexible scheduling</Badge>
                <Badge icon={MapPin}>Pickup / delivery by request</Badge>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#fleet"
                  className="inline-flex items-center justify-center rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-black hover:opacity-90"
                >
                  View Fleet
                </a>
                <a
                  href="#inquiry"
                  className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white/90 hover:bg-white/10"
                >
                  Start Inquiry
                </a>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {["Transparent pricing", "Fast responses", "Luxury-first service"].map((t) => (
                  <div
                    key={t}
                    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-white/70"
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-white/70" />
                      {t}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-6">
              <Card className="overflow-hidden">
                <div className="relative">
                  <img
                    src={selected.image}
                    alt={selected.name}
                    className="h-[240px] w-full object-cover sm:h-[340px]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-end justify-between gap-4">
                      <div>
                        <div className="text-sm text-white/70">Featured</div>
                        <div className="text-xl font-semibold">{selected.name}</div>
                        <div className="mt-1 text-sm text-white/70">
                          {formatUSD(selected.price)} / {selected.priceUnit}
                        </div>
                      </div>
                      <a
                        href="#inquiry"
                        className="hidden rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-black hover:opacity-90 sm:inline-flex"
                      >
                        Inquire
                      </a>
                    </div>
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex flex-wrap gap-2">
                    {selected.highlights.map((h) => (
                      <span
                        key={h}
                        className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70"
                      >
                        {h}
                      </span>
                    ))}
                  </div>
                  <p className="mt-4 text-xs text-white/60">
                    *Pricing shown is per-day. Taxes/fees, deposit, and eligibility requirements may apply.
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Fleet */}
        <section id="fleet" className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <SectionTitle
            kicker="FLEET"
            title="Choose your ride"
            subtitle="Tap any vehicle to feature it in the header, then submit an inquiry with your dates and documents."
          />

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {FLEET.map((car) => {
              const active = car.id === selectedCar;
              return (
                <button
                  key={car.id}
                  onClick={() => setSelectedCar(car.id)}
                  className={cn(
                    "text-left",
                    "rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10",
                    active && "ring-2 ring-white/40"
                  )}
                >
                  <div className="relative">
                    <img
                      src={car.image}
                      alt={car.name}
                      className="h-36 w-full rounded-t-2xl object-cover"
                    />
                    <div className="absolute inset-0 rounded-t-2xl bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <div className="text-sm font-semibold">{car.name}</div>
                      <div className="text-xs text-white/70">
                        {formatUSD(car.price)} / {car.priceUnit}
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <ul className="space-y-2 text-xs text-white/70">
                      {car.highlights.slice(0, 3).map((h) => (
                        <li key={h} className="flex items-start gap-2">
                          <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-white/50" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-6 flex items-center justify-center text-xs text-white/60">
            <Plus className="mr-2 h-4 w-4" />
            Adding more cars later is easy — just add a new item to the <code className="mx-1 rounded bg-white/10 px-2 py-1">FLEET</code> list.
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <SectionTitle
            kicker="PROCESS"
            title="How it works"
            subtitle="A clean, premium booking flow your customers can finish from their phone."
          />

          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {[
              {
                title: "1) Pick a vehicle",
                body: "Choose your car and your preferred rental dates.",
              },
              {
                title: "2) Upload documents",
                body: "Upload the required documents to speed up approval.",
              },
              {
                title: "3) Get confirmed",
                body: "We verify availability, confirm pricing, and send next steps.",
              },
            ].map((s) => (
              <Card key={s.title} className="p-6">
                <div className="text-sm font-semibold">{s.title}</div>
                <div className="mt-2 text-sm text-white/70">{s.body}</div>
              </Card>
            ))}
          </div>

          <Card className="mt-6 p-6">
            <div className="text-sm font-semibold">Documents typically required</div>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              {REQUIRED_DOCS.map((d) => (
                <div
                  key={d}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70"
                >
                  {d}
                </div>
              ))}
            </div>
            <div className="mt-4 text-xs text-white/60">
              *Exact requirements may vary by vehicle, dates, age, and insurance eligibility.
            </div>
          </Card>
        </section>

        {/* Inquiry */}
        <section id="inquiry" className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <SectionTitle
            kicker="INQUIRY"
            title="Submit your inquiry"
            subtitle="Fill this out, upload your documents, and we’ll contact you fast."
          />

          <div className="mt-8 grid gap-6 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <Card className="p-6">
                <div className="text-sm font-semibold">Direct contact</div>
                <div className="mt-4 space-y-3 text-sm text-white/75">
                  <a className="flex items-center gap-2 hover:text-white" href={`mailto:${BRAND.businessEmail}`}>
                    <Mail className="h-4 w-4" /> {BRAND.businessEmail}
                  </a>
                  <a className="flex items-center gap-2 hover:text-white" href={`tel:${BRAND.businessPhoneE164}`}>
                    <Phone className="h-4 w-4" /> {BRAND.businessPhone}
                  </a>
                  <div className="text-xs text-white/60">
                    Instagram: <span className="text-white/80">{BRAND.instagram}</span>
                  </div>
                </div>

                <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-white/70">
                  <div className="font-semibold text-white/85">Owner note</div>
                  <div className="mt-2">
                    Want a true “Book Now” checkout later? We can add Stripe payments + automated calendar availability.
                  </div>
                </div>
              </Card>
            </div>

            <div className="lg:col-span-7">
              <Card className="p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Formspree helpers */}
                  <input type="hidden" name="_subject" value="New Rental Inquiry — Marque Concierge" />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="text-xs text-white/70">Full name</label>
                      <input
                        name="name"
                        required
                        className="mt-1 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none placeholder:text-white/30 focus:border-white/30"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-white/70">Phone</label>
                      <input
                        name="phone"
                        required
                        className="mt-1 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none placeholder:text-white/30 focus:border-white/30"
                        placeholder="(555) 555-5555"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="text-xs text-white/70">Email</label>
                      <input
                        name="email"
                        type="email"
                        required
                        className="mt-1 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none placeholder:text-white/30 focus:border-white/30"
                        placeholder="you@email.com"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-white/70">Vehicle</label>
                      <select
                        name="vehicle"
                        value={selectedCar}
                        onChange={(e) => setSelectedCar(e.target.value)}
                        className="mt-1 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none focus:border-white/30"
                      >
                        {FLEET.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name} — {formatUSD(c.price)}/{c.priceUnit}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="text-xs text-white/70">Start date</label>
                      <input
                        name="startDate"
                        type="date"
                        required
                        className="mt-1 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none focus:border-white/30"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-white/70">End date</label>
                      <input
                        name="endDate"
                        type="date"
                        required
                        className="mt-1 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none focus:border-white/30"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-white/70">Notes (pickup location, delivery, etc.)</label>
                    <textarea
                      name="notes"
                      rows={3}
                      className="mt-1 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none placeholder:text-white/30 focus:border-white/30"
                      placeholder="Tell us what you need…"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-white/70">Upload documents</label>
                    <div className="mt-1 rounded-2xl border border-dashed border-white/20 bg-white/5 p-4">
                      <div className="flex flex-col items-center justify-center gap-2 text-center">
                        <Upload className="h-5 w-5 text-white/70" />
                        <div className="text-sm text-white/80">Drag & drop or choose files</div>
                        <div className="text-xs text-white/50">PDF, JPG, PNG — up to 10 files</div>
                        <input
                          type="file"
                          multiple
                          accept="application/pdf,image/*"
                          onChange={(e) => setFiles(Array.from(e.target.files || []))}
                          className="mt-2 w-full text-xs text-white/70 file:mr-3 file:rounded-xl file:border-0 file:bg-white file:px-4 file:py-2 file:text-xs file:font-semibold file:text-black hover:file:opacity-90"
                        />
                      </div>
                      {files.length > 0 ? (
                        <div className="mt-4 space-y-2">
                          <div className="text-xs text-white/60">Selected:</div>
                          <ul className="max-h-28 overflow-auto rounded-xl bg-black/40 p-3 text-xs text-white/70">
                            {files.map((f) => (
                              <li key={f.name} className="flex items-center justify-between gap-3">
                                <span className="truncate">{f.name}</span>
                                <span className="shrink-0 text-white/40">
                                  {Math.max(1, Math.round(f.size / 1024))} KB
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : null}
                    </div>
                    <div className="mt-2 text-xs text-white/55">
                      Tip: In production, uploads should be stored securely (S3/Drive) and emailed as links.
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={status.state === "sending"}
                    className="w-full rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-black hover:opacity-90 disabled:opacity-60"
                  >
                    {status.state === "sending" ? "Submitting…" : "Submit Inquiry"}
                  </button>

                  {status.state !== "idle" ? (
                    <div
                      className={cn(
                        "rounded-2xl border px-4 py-3 text-sm",
                        status.state === "success" && "border-emerald-500/30 bg-emerald-500/10 text-emerald-100",
                        status.state === "error" && "border-red-500/30 bg-red-500/10 text-red-100",
                        status.state === "sending" && "border-white/15 bg-white/5 text-white/80"
                      )}
                    >
                      {status.message}
                    </div>
                  ) : null}

                  <div className="text-[11px] leading-5 text-white/55">
                    By submitting, you agree to be contacted about your inquiry. Rates shown are base daily rates.
                    Deposits, insurance verification, and additional policies may apply.
                  </div>
                </form>
              </Card>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <SectionTitle
            kicker="FAQ"
            title="Quick answers"
            subtitle="Common questions customers ask before booking."
          />

          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            {[
              {
                q: "Can I add more vehicles later?",
                a: "Yes — this site is set up so you can add cars by editing one list. We can also connect it to a database/admin panel later.",
              },
              {
                q: "Does the upload go to email + phone?",
                a: "In preview mode it’s simulated. In production you’ll connect a secure backend that emails you the inquiry and texts your phone.",
              },
              {
                q: "Can customers pay online?",
                a: "Yes. Next step is Stripe for deposits/payments + an availability calendar.",
              },
              {
                q: "Is document upload secure?",
                a: "We recommend storing files in a secure bucket (S3/Drive) and emailing you a private link rather than attaching large files.",
              },
            ].map((item) => (
              <Card key={item.q} className="p-6">
                <div className="text-sm font-semibold">{item.q}</div>
                <div className="mt-2 text-sm text-white/70">{item.a}</div>
              </Card>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="relative z-10 border-t border-white/10">
          <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-10 text-sm text-white/60 sm:px-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-white/80">{BRAND.name}</div>
              <div className="text-xs">© {new Date().getFullYear()} — All rights reserved.</div>
            </div>
            <div className="flex flex-wrap gap-3">
              <a className="hover:text-white" href={`mailto:${BRAND.businessEmail}`}>
                Email
              </a>
              <a className="hover:text-white" href={`tel:${BRAND.businessPhoneE164}`}>
                Call
              </a>
              <a className="hover:text-white" href="#inquiry">
                Inquiry
              </a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
