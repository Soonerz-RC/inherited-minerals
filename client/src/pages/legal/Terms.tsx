import { PageShell, DisclaimerNote } from "@/components/SiteLayout";
import { usePageMeta } from "@/hooks/use-page-meta";

const COMPANY = "OklahomaMinerals.com";
const CONTACT_EMAIL = "g.knight@oklahomaminerals.com";
const GOVERNING_STATE = "Nevada";
const EFFECTIVE_DATE = "June 1, 2026";

export default function Terms() {
  usePageMeta(
    "Terms of Use | Inherited Mineral Rights",
    "The terms that govern your use of InheritedMineralRights.com, including acceptable use and the educational nature of the content.",
  );

  return (
    <PageShell>
      <article className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-16">
        <h1 className="text-balance text-4xl font-semibold text-foreground">Terms of Use</h1>
        <p className="mt-3 text-sm text-muted-foreground">Effective date: {EFFECTIVE_DATE}</p>

        <div className="prose prose-stone mt-8 max-w-none text-muted-foreground prose-headings:font-serif prose-headings:text-foreground prose-strong:text-foreground prose-a:text-primary">
          <p>
            These Terms of Use (“Terms”) govern your access to and use of
            InheritedMineralRights.com (the “Site”), operated by {COMPANY} (“we,”
            “us,” or “our”). By using the Site, you agree to these Terms. If you do
            not agree, please do not use the Site.
          </p>

          <h2>Educational purpose only</h2>
          <p>
            The Site provides general, plain-English educational information about
            inherited mineral rights. It is <strong>not</strong> legal, tax,
            financial, or investment advice, and using the Site does not create an
            attorney–client, fiduciary, or other professional relationship. See our{" "}
            <a href="#/disclaimer">Disclaimer</a> for details. Always consult a
            qualified professional about your specific situation.
          </p>

          <h2>No guarantee of outcomes</h2>
          <p>
            Any valuations, ranges, offers, or estimates discussed are
            illustrative and not guarantees. The value of mineral rights depends on
            many factors and can change. Nothing on the Site is an offer to buy or
            sell, or a commitment of any kind, unless and until set out in a
            separate signed written agreement.
          </p>

          <h2>Acceptable use</h2>
          <ul>
            <li>Use the Site only for lawful purposes and as permitted by these Terms.</li>
            <li>Do not submit false information or impersonate others.</li>
            <li>Do not post unlawful, harmful, or infringing content to community features.</li>
            <li>Do not attempt to disrupt, reverse engineer, or gain unauthorized access to the Site.</li>
            <li>When using community features, keep posts general and do not share others' private information.</li>
          </ul>

          <h2>Submissions and community content</h2>
          <p>
            If you submit a question, request, or other content, you grant us a
            non-exclusive, royalty-free license to use it to operate and improve
            the Site (for example, to display community questions). You are
            responsible for what you submit and confirm you have the right to share
            it.
          </p>

          <h2>Intellectual property</h2>
          <p>
            The Site and its content, excluding content you submit, are owned by us
            or our licensors and protected by applicable laws. You may not copy or
            redistribute Site content without permission.
          </p>

          <h2>Third-party links and tools</h2>
          <p>
            The Site may link to or use third-party tools and websites. We are not
            responsible for their content or practices, and your use of them is
            governed by their own terms.
          </p>

          <h2>Disclaimers and limitation of liability</h2>
          <p>
            The Site is provided “as is” and “as available,” without warranties of
            any kind, to the fullest extent permitted by law. To the fullest extent
            permitted by law, we will not be liable for any indirect, incidental,
            or consequential damages arising from your use of the Site or reliance
            on its content.
          </p>

          <h2>Indemnification</h2>
          <p>
            You agree to indemnify and hold us harmless from claims arising out of
            your use of the Site or violation of these Terms, to the extent
            permitted by law.
          </p>

          <h2>Changes</h2>
          <p>
            We may update these Terms from time to time. Continued use of the Site
            after changes means you accept the updated Terms.
          </p>

          <h2>Governing law</h2>
          <p>
            These Terms are governed by the laws of {GOVERNING_STATE}, without
            regard to its conflict-of-laws rules.
          </p>

          <h2>Contact</h2>
          <p>Questions about these Terms? Contact us at <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.</p>
        </div>

        <DisclaimerNote className="mt-10" />
      </article>
    </PageShell>
  );
}
