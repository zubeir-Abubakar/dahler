import { useTranslation } from "react-i18next";
import { ArrowUpRight, Mail, MapPin, Phone, Printer } from "lucide-react";

import { company } from "@/data/company";
import { useSeo } from "@/lib/seo";
import PageHero from "@/components/ui/PageHero";
import Reveal from "@/components/ui/Reveal";
import ContactForm from "@/components/contact/ContactForm";

interface TeamCopy {
  role: string;
  focus: string;
}

export default function ContactPage() {
  useSeo("contact");
  const { t } = useTranslation();
  const teamCopy = t("contact.team.members", { returnObjects: true }) as Record<
    string,
    TeamCopy
  >;

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
        <div className="container-x grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <Reveal>
            <div className="rounded-2xl border border-line bg-paper p-7 sm:p-8">
              <h2 className="type-h3">{t("contact.details.title")}</h2>
              <address className="mt-6 flex flex-col gap-5 text-sm not-italic">
                <div className="flex items-start gap-3">
                  <MapPin
                    aria-hidden="true"
                    className="mt-0.5 h-4 w-4 shrink-0 text-forest"
                    strokeWidth={1.7}
                  />
                  <p className="leading-relaxed text-ink-soft">
                    {company.street}
                    <br />
                    {company.postalCode} {company.city}
                    <br />
                    {company.country}
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <Phone
                    aria-hidden="true"
                    className="mt-0.5 h-4 w-4 shrink-0 text-forest"
                    strokeWidth={1.7}
                  />
                  <a
                    href={`tel:${company.phoneHref}`}
                    className="text-ink transition-colors hover:text-forest"
                  >
                    {company.phone}
                  </a>
                </div>
                <div className="flex items-start gap-3">
                  <Mail
                    aria-hidden="true"
                    className="mt-0.5 h-4 w-4 shrink-0 text-forest"
                    strokeWidth={1.7}
                  />
                  <a
                    href={`mailto:${company.email}`}
                    className="break-words text-ink transition-colors hover:text-forest"
                  >
                    {company.email}
                  </a>
                </div>
                <div className="flex items-start gap-3">
                  <Printer
                    aria-hidden="true"
                    className="mt-0.5 h-4 w-4 shrink-0 text-forest"
                    strokeWidth={1.7}
                  />
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
          </Reveal>

          <Reveal delay={0.08} className="lg:pt-2">
            <ContactForm />
          </Reveal>
        </div>
      </section>

      {/* ---------------------------------------------------------------- team */}
      <section className="border-t border-line bg-paper">
        <div className="container-x section-y-sm">
          <Reveal className="max-w-2xl">
            <p className="eyebrow">{t("contact.team.eyebrow")}</p>
            <h2 className="type-h2 mt-4">{t("contact.team.title")}</h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft sm:text-base">
              {t("contact.team.intro")}
            </p>
          </Reveal>

          <ul className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {company.team.map((member, index) => {
              const copy = teamCopy[member.id];
              return (
                <li key={member.id} className="h-full">
                  <Reveal delay={index * 0.05} distance={12} className="h-full">
                    <article className="flex h-full flex-col rounded-xl border border-line bg-cream/70 p-5">
                      <div className="flex items-start gap-4">
                        <img
                          src={member.image}
                          alt={member.name}
                          width={50}
                          height={60}
                          loading="lazy"
                          className="h-16 w-[3.35rem] shrink-0 rounded-md border border-line object-cover"
                        />
                        <div className="min-w-0">
                          <h3 className="type-h3 text-lg">{member.name}</h3>
                          <p className="mt-1 text-xs leading-snug text-ink-soft">{copy?.role}</p>
                        </div>
                      </div>

                      <p className="mt-4 text-xs leading-relaxed text-stone">{copy?.focus}</p>

                      <div className="mt-auto flex flex-col gap-2.5 border-t border-line pt-4 text-xs">
                        <a
                          href={`mailto:${member.email}`}
                          className="inline-flex items-start gap-2 break-words text-ink transition-colors hover:text-forest"
                        >
                          <Mail
                            aria-hidden="true"
                            className="mt-0.5 h-3.5 w-3.5 shrink-0 text-forest"
                            strokeWidth={1.7}
                          />
                          {member.email}
                        </a>
                        <a
                          href={`tel:${company.phoneHref}`}
                          className="inline-flex items-start gap-2 text-ink transition-colors hover:text-forest"
                        >
                          <Phone
                            aria-hidden="true"
                            className="mt-0.5 h-3.5 w-3.5 shrink-0 text-forest"
                            strokeWidth={1.7}
                          />
                          <span>
                            {company.phone}
                            <span className="text-stone"> · {t("contact.team.phoneLabel")}</span>
                          </span>
                        </a>
                      </div>
                    </article>
                  </Reveal>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ------------------------------------------------------------------ map */}
      <section className="border-t border-line bg-paper pb-16 sm:pb-20">
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
