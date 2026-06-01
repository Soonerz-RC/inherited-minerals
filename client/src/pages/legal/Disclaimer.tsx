import { ShieldCheck } from "lucide-react";
import { PageShell } from "@/components/SiteLayout";
import { usePageMeta } from "@/hooks/use-page-meta";

export default function Disclaimer() {
  usePageMeta(
    "Disclaimer | Inherited Mineral Rights",
    "The information on InheritedMineralRights.com is educational only and is not legal, tax, or financial advice.",
  );

  return (
    <PageShell>
      <article className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-16">
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-8 w-8 text-primary" />
          <h1 className="text-balance text-4xl font-semibold text-foreground">Disclaimer</h1>
        </div>

        <div className="prose prose-stone mt-8 max-w-none text-muted-foreground prose-headings:font-serif prose-headings:text-foreground prose-strong:text-foreground prose-a:text-primary">
          <h2>Educational information only</h2>
          <p>
            Everything on InheritedMineralRights.com — including articles, guides,
            community answers, and responses from the on-site assistant — is
            general educational information intended to help you ask better
            questions and understand common concepts. It is{" "}
            <strong>not legal, tax, financial, or investment advice</strong>, and
            it should not be relied on as a substitute for advice from a qualified
            professional who knows your specific situation.
          </p>

          <h2>No professional relationship</h2>
          <p>
            Using this Site, contacting us, or submitting a form does not create an
            attorney–client, accountant–client, fiduciary, or other professional
            relationship. We do not hold ourselves out as your attorney, CPA, or
            financial advisor, and we do not provide such services through this
            Site.
          </p>

          <h2>No guarantee of value or outcomes</h2>
          <p>
            The value of mineral rights depends on many factors and can change over
            time. Any estimates, ranges, or offers discussed are illustrative only
            and are <strong>not guaranteed</strong>. Offers to purchase, if any,
            are only binding when set out in a separate signed written agreement.
            Past results and general examples do not predict your outcome.
          </p>

          <h2>Consult qualified professionals</h2>
          <p>
            Decisions about inherited minerals — including probate and title,
            taxes, leasing, and whether to sell — can have lasting legal and
            financial consequences. Before acting, consult a qualified attorney,
            CPA, or licensed financial professional who can advise you based on
            your specific facts and the laws of the state where your minerals are
            located.
          </p>

          <h2>Third-party information</h2>
          <p>
            We may reference third-party sources or tools for convenience. We don't
            control and aren't responsible for their accuracy or content.
          </p>

          <p>
            By using this Site, you acknowledge and agree to this Disclaimer and to
            our <a href="#/terms">Terms of Use</a> and{" "}
            <a href="#/privacy">Privacy Policy</a>.
          </p>
        </div>
      </article>
    </PageShell>
  );
}
