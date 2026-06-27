import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { PolicyDocument } from "@/content/policies/types";
import { policyLinks } from "@/content/policies";

type PolicyPageProps = {
  policy: PolicyDocument;
};

export default function PolicyPage({ policy }: PolicyPageProps) {
  const relatedLinks = policyLinks.filter((link) => link.href !== `/${policy.slug}`);

  return (
    <>
      <section className="border-b border-charcoal/5 bg-cream/40">
        <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8 lg:py-12">
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-2 text-xs tracking-wide text-muted uppercase"
          >
            <Link href="/" className="transition-colors hover:text-gold-dark">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5" aria-hidden />
            <span className="text-charcoal">{policy.title}</span>
          </nav>

          <div className="mt-8 max-w-3xl">
            <p className="text-[11px] tracking-[0.35em] text-gold uppercase">
              Legal
            </p>
            <h1 className="mt-3 font-serif text-4xl text-charcoal md:text-5xl">
              {policy.title}
            </h1>
            <p className="mt-4 text-sm text-muted">
              Last updated: {policy.lastUpdated}
            </p>
            <p className="mt-6 text-base leading-relaxed text-muted md:text-lg">
              {policy.intro}
            </p>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-16 xl:grid-cols-[280px_minmax(0,1fr)]">
            <aside className="hidden lg:block">
              <div className="sticky top-28 border border-charcoal/5 bg-cream/20 p-6">
                <p className="text-[10px] font-semibold tracking-[0.3em] text-gold uppercase">
                  On this page
                </p>
                <ul className="mt-5 space-y-3">
                  {policy.sections.map((section) => (
                    <li key={section.id}>
                      <a
                        href={`#${section.id}`}
                        className="block text-sm leading-snug text-muted transition-colors hover:text-gold-dark"
                      >
                        {section.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>

            <article className="min-w-0">
              <div className="mb-10 rounded border border-gold/20 bg-gold/5 px-5 py-4 lg:hidden">
                <p className="text-[10px] font-semibold tracking-[0.3em] text-gold uppercase">
                  Jump to section
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {policy.sections.map((section) => (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      className="rounded-full border border-charcoal/10 bg-white px-3 py-1.5 text-xs text-muted transition-colors hover:border-gold/30 hover:text-charcoal"
                    >
                      {section.title}
                    </a>
                  ))}
                </div>
              </div>

              <div className="space-y-12">
                {policy.sections.map((section, index) => (
                  <section
                    key={section.id}
                    id={section.id}
                    className="scroll-mt-28 border-b border-charcoal/5 pb-12 last:border-b-0 last:pb-0"
                  >
                    <div className="flex items-start gap-4">
                      <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gold/20 bg-gold/5 text-xs font-medium text-gold-dark">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <div className="min-w-0 flex-1">
                        <h2 className="font-serif text-2xl text-charcoal md:text-3xl">
                          {section.title}
                        </h2>
                        <div className="mt-5 space-y-4">
                          {section.paragraphs.map((paragraph, paragraphIndex) => (
                            <p
                              key={`${section.id}-${paragraphIndex}`}
                              className="text-base leading-relaxed text-muted"
                            >
                              {paragraph}
                            </p>
                          ))}
                          {section.listItems && section.listItems.length > 0 && (
                            <ul className="list-disc space-y-2 pl-5 text-base leading-relaxed text-muted marker:text-gold-dark">
                              {section.listItems.map((item, itemIndex) => (
                                <li key={`${section.id}-list-${itemIndex}`}>
                                  {item}
                                </li>
                              ))}
                            </ul>
                          )}
                          {section.afterList?.map((paragraph, paragraphIndex) => (
                            <p
                              key={`${section.id}-after-${paragraphIndex}`}
                              className="text-base leading-relaxed text-muted"
                            >
                              {paragraph}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  </section>
                ))}
              </div>

              <aside className="mt-16 border border-charcoal/5 bg-charcoal p-8 text-white md:p-10">
                <p className="text-[10px] font-semibold tracking-[0.3em] text-gold uppercase">
                  Related policies
                </p>
                <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                  {relatedLinks.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="block text-sm text-gray-300 transition-colors hover:text-gold"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link
                      href="/contact"
                      className="block text-sm text-gray-300 transition-colors hover:text-gold"
                    >
                      Contact Us
                    </Link>
                  </li>
                </ul>
              </aside>
            </article>
          </div>
        </div>
      </section>
    </>
  );
}
