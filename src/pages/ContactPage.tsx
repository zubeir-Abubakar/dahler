import { useTranslation } from "react-i18next";
import { ArrowUpRight, MapPin, Phone, Printer } from "lucide-react";

import { company } from "@/data/company";
import { useSeo } from "@/lib/seo";
import PageHero from "@/components/ui/PageHero";
import Reveal from "@/components/ui/Reveal";
import ContactForm from "@/components/contact/ContactForm";

interface TeamMember {
  name: string;
  role: string;
  focus: string;
}

const initials = (name: string) =>
  name
    .replace(/[a-z]+\./g, "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

export default function ContactPage() {
  useSeo("contact");
  const { t } = useTranslation();
  const team = t("contact.team.members", { returnObjects: true }) as TeamMember[];

  return (
    <>
      <PageHero
        eyebrow={t("contact.eyebrow")}
        title={t("contact.title")}
        text={t("contact.intro")}
        image="/images/hero/hero-market.jpg"
        imageAlt={t("home.hero.imageAlt")}
      />

      {/* ------------------------------------------------------------ form + info */}
      <section className="section-y">
        <div className="container-x grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <Reveal>
            <div className="rounded-2xl border border-line bg-paper p-7 sm:p-8">
              <h2 className="type-h3">{t("contact.details.title")}</h2>
              <address className="mt-6 flex flex-col gap-5 text-sm not-italic">
                <div className="flex items-start gap-3">
                  <MapPin aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-forest" strokeWidth={1.7} />
                  <p className="leading-relaxed text-ink-soft">
                    {company.street}
                    <br />
                    {company.postalCode} {company.city}
                    <br />
                    {company.country}
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <Phone aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-forest" strokeWidth={1.7} />
                  <a href={`tel:${company.phoneHref}`} className="text-ink transition-colors hover:text-forest">
                    {company.phone}
                  </a>
                </div>
                <div className="flex items-start gap-3">
                  <Printer aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-forest" strokeWidth={1.7} />
                  <p className="text-ink-soft">
                    <span className="text-stone">{t("contact.details.fax")}: </span>
                    {company.fax}
                  </p>
                </div>
              </address>
              <dl className="mt-6 border-t border-line pt-5 text-sm">
                <div className="flex items-baseline justify-between gap-3">
                  <dt className="text-stone">{t("contact.details.vat")}</dt>
                  <dd>{company.vat}</dd>
                </div>
              </dl>
            </div>

            <div className="mt-10">
              <h2 className="font-sans text-[0.6875rem] font-medium tracking-[0.18em] text-stone uppercase">
                {t("contact.team.title")}
              </h2>
              <ul className="mt-5 flex flex-col divide-y divide-line border-y border-line">
                {team.map((member) => (
                  <li key={member.name} className="flex items-start gap-4 py-5">
                    <span
                      aria-hidden="true"
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-forest font-display text-sm text-cream"
                    >
                      {initials(member.name)}
                    </span>
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="mt-0.5 text-sm leading-snug text-ink-soft">{member.role}</p>
                      <p className="mt-1 text-xs leading-snug text-stone">{member.focus}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="lg:pt-2">
            <ContactForm />
          </Reveal>
        </div>
      </section>

      {/* ------------------------------------------------------------------ map */}
      <section className="border-t border-line bg-paper pb-20 sm:pb-24">
        <div className="container-x">
          <div className="flex flex-col gap-4 py-10 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="type-h2">{t("contact.map.title")}</h2>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-soft">
                {t("contact.map.text")}
              </p>
            </div>
            <a
              href={company.mapsDirections}
              target="_blank"
              rel="noreferrer noopener"
              className="btn btn-outline"
            >
              {t("contact.map.directions")}
              <ArrowUpRight aria-hidden="true" className="h-4 w-4" strokeWidth={1.7} />
            </a>
          </div>

          <div className="media aspect-[16/9] min-h-[20rem] w-full border border-line bg-cream-deep">
            <iframe
              title={t("contact.map.iframeTitle")}
              src={company.mapsEmbed}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
              className="h-full w-full border-0"
            />
          </div>
        </div>
      </section>
    </>
  );
}
