import { PageShell, DisclaimerNote } from "@/components/SiteLayout";
import { usePageMeta } from "@/hooks/use-page-meta";

const COMPANY = "OklahomaMinerals.com";
const CONTACT_EMAIL = "g.knight@oklahomaminerals.com";
const MAILING_ADDRESS = "1930 Village Center Circle, 3-251, Las Vegas, NV 89134";
const EFFECTIVE_DATE = "June 1, 2026";

export default function Privacy() {
  usePageMeta(
    "Privacy Policy | Inherited Mineral Rights",
    "How InheritedMineralRights.com collects, uses, and protects the information you share, including form submissions and analytics.",
  );

  return (
    <PageShell>
      <article className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-16">
        <h1 className="text-balance text-4xl font-semibold text-foreground">Privacy Policy</h1>
        <p className="mt-3 text-sm text-muted-foreground">Effective date: {EFFECTIVE_DATE}</p>

        <div className="prose prose-stone mt-8 max-w-none text-muted-foreground prose-headings:font-serif prose-headings:text-foreground prose-strong:text-foreground prose-a:text-primary">
          <p>
            This Privacy Policy explains how {COMPANY} (“we,” “us,” or “our”),
            operator of InheritedMineralRights.com (the “Site”), collects, uses,
            and shares information when you use the Site. We built this Site to
            help people who have inherited oil and gas mineral rights, and we try
            to handle your information with the same care we'd want for our own.
          </p>

          <h2>Information we collect</h2>
          <ul>
            <li>
              <strong>Information you give us.</strong> When you request a private
              review, post a community question, or contact us, we collect what you
              choose to share — such as your name, email address, the state and
              county where minerals are located, whether minerals are producing,
              the documents you have, and any notes or questions you submit.
            </li>
            <li>
              <strong>Mineral and property details.</strong> Details you provide
              about inherited minerals, deeds, leases, royalty statements, or
              offers, so we can review your situation.
            </li>
            <li>
              <strong>Assistant interactions.</strong> If you use the on-site
              assistant, we may log the questions you ask and the educational
              responses provided, to improve the experience. Please do not enter
              account numbers or other sensitive personal details.
            </li>
            <li>
              <strong>Automatically collected information.</strong> Like most
              websites, we and our analytics and advertising partners may collect
              technical information such as your IP address, device and browser
              type, pages viewed, and referring URLs, including through cookies and
              similar technologies set by those partners (see below).
            </li>
            <li>
              <strong>Marketing attribution.</strong> When you submit a form, we
              may record the page you submitted from and marketing parameters
              (such as UTM tags and the referring page) to understand which
              campaigns reach people who need help.
            </li>
          </ul>

          <h2>Analytics and advertising</h2>
          <p>
            We may use third-party analytics and advertising tools — for example
            Google Analytics, Google Ads, and the Meta (Facebook) Pixel — to
            understand how the Site is used and to measure and improve our
            advertising. These tools may set cookies or use similar technologies
            and may collect information about your activity over time and across
            websites. These tools load only when configured, and each provider
            handles the data it collects under its own privacy policy. You can
            often control ad personalization through your Google and Meta account
            settings and through browser controls.
          </p>

          <h2>How we use information</h2>
          <ul>
            <li>To review your situation and respond to your requests and questions.</li>
            <li>To operate, maintain, and improve the Site and our services.</li>
            <li>To measure and improve our marketing, and to understand which campaigns are effective.</li>
            <li>To communicate with you about your request, including by email or phone if you provide contact details.</li>
            <li>To comply with legal obligations and to protect our rights and the rights of others.</li>
          </ul>

          <h2>How we share information</h2>
          <p>
            We do <strong>not</strong> sell your personal information to
            marketers. We may share information with service providers who help us
            operate the Site (such as hosting, database, email, and analytics
            providers), with professional advisors, and when required by law or to
            protect rights and safety. If our business is involved in a merger or
            acquisition, information may be transferred as part of that
            transaction.
          </p>

          <h2>Data retention</h2>
          <p>
            We keep the information you submit for as long as needed to review your
            situation, provide our services, and meet legal and recordkeeping
            requirements, then delete or de-identify it.
          </p>

          <h2>Your choices</h2>
          <ul>
            <li>You can ask us to access, correct, or delete information you've submitted by contacting us.</li>
            <li>You can opt out of marketing emails using the unsubscribe link or by contacting us.</li>
            <li>You can use browser and platform controls to limit cookies and ad personalization.</li>
          </ul>
          <p>
            Depending on where you live, you may have additional rights under laws
            such as the CCPA/CPRA or similar state privacy laws. Contact us to
            exercise any rights you have.
          </p>

          <h2>Children</h2>
          <p>
            The Site is intended for adults and is not directed to children under
            13, and we do not knowingly collect information from them.
          </p>

          <h2>Changes to this policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We'll post the
            updated version here and revise the effective date above.
          </p>

          <h2>Contact us</h2>
          <p>
            Questions about this policy or your information? Contact us at{" "}
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> or {MAILING_ADDRESS}.
          </p>
        </div>

        <DisclaimerNote className="mt-10" />
      </article>
    </PageShell>
  );
}
