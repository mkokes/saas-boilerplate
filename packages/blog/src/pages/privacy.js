import React from "react";
import Layout from "../components/layout";
import Header from "../components/header";
import Footer from "../components/footer";

const PrivacyPage = () => (
  <Layout>
    <div className="main-background">
      <Header />

      <div className="container">
        <h2>Privacy Policy</h2>
        <p>
          We may update this policy from time to time. Please check this page
          regularly for notification of any significant changes in the way we
          treat your personal information. We will try to provide Consumers with
          reasonable advance notice of any proposed changes.
        </p>
        <p>
          Where the words '<em>Dependabot</em>
          ', '<em>we</em>
          ', '<em>us</em>' or '<em>our</em>' are used in this document, they are
          all references to Dependabot Limited.
        </p>
        <p>
          Your privacy is very important to us. We have put in place measures to
          ensure that any personal information or data that we obtain from you
          is processed in accordance with the accepted principles of good
          information handling.
        </p>
        <h3>What this privacy policy covers</h3>
        <p>
          This policy gives you information about how we treat personal
          information received from our website visitors and customers.
        </p>
        <h3>What is personal information?</h3>
        <p>
          Personal information is defined as information that may be used to
          identify a living individual, such as their title, name, address,
          email address and phone number.
        </p>
        <h3>Information collection and use</h3>
        <p>We collect visitor information in the following ways:</p>
        <ul>
          <li>
            If you link Dependabot to your GitHub account, we will use your
            details to conduct automated dependency management for your GitHub
            repositories.
          </li>
          <li>
            If you call us or send us an enquiry or details via email or another
            method, we will use your details to respond to any request/comment
            you have. We may also keep these details for the purpose of
            evaluating and assessing applications, performing contracts and
            technical administration.
          </li>
        </ul>
        <p>
          When you visit our website, we may automatically collect certain
          system-related information about your visit, and we also use 'cookies'
          to provide you with access to certain private areas of the website.
          See the 'Cookies' section below for further information.
        </p>
        <p>
          The only time we will use your details for any other purpose than
          those listed above is to provide you with details from time to time
          about our services. However we will only do this if either (i) you
          have given us permission to do so, or (ii) you are one of our
          customers and we are telling you about similar products and services
          to the ones you have previously purchased or asked us about. In each
          case you can contact us to opt out of any further marketing
          communications.
        </p>
        <p>
          We may pass your personal information to our subcontractors to enable
          them to provide services for us but for no other purpose. We respect
          your privacy and will not rent, sell or share personal information
          about you with other people or non-affiliated companies without your
          express permission.
        </p>
        <h3>Information collection and use</h3>
        <p>
          You have the right to request a copy of the personal information we
          hold about you, its origin and any recipients of it as well as the
          purpose of any data processing carried out. Please note that, in
          accordance with the Data Protection Act 1998, a £10 admin fee is
          applicable. For further information, please contact us by emailing{" "}
          <a href="mailto:support@dependabot.com">support@dependabot.com</a>{" "}
          with the subject 'Data subject access request'.
        </p>
        <p>
          In accordance with the Data Protection Act 1998, you have the right to
          correct, restrict our use of or ask us to delete your personal
          information. Use the details on the 'Contact Us' to ask any questions
          or request the correction, restriction or deletion of your personal
          information.
        </p>
        <h3>Cookies</h3>
        <p>
          Our web site uses cookies – small text files stored on your computer –
          in two ways.
        </p>
        <p>
          The first is to collect system-related information, such as the type
          of internet browser and operating system you use, the website from
          which you have come to our website, the duration of individual page
          views, paths taken by visitors through the website, and other general
          information and your IP address (the unique address which identifies
          your computer on the internet) which is automatically recognised by
          our web server. This information is collected for system
          administration and to report aggregate information to our
          subcontractors and partners to enable them to provide services to us.
          It is statistical data about our users' browsing actions and does not,
          of itself, contain any personally identifiable information. It is
          often not possible to identify a specific individual from this
          information, although for example we may be able to identify it
          relates to a specific individual in conjunction with other information
          in our control.
        </p>
        <p>
          The second is that Cookies are also used when registered users access
          the private sections of our website. Cookies are used to facilitate
          the log in process. In this case, we may be able to identify that your
          login details have been used.
        </p>
        <p>
          Most web browsers offer users controls, to give you the option to
          delete or disable cookies. You can usually find out how to do so by
          referring to the ‘Help’ option on the menu bar of your browser, or by
          visiting the browser developer's website. This will usually tell you
          how to prevent your browser from accepting new cookies; notify you
          when you receive new cookies; and disable cookies altogether. Please
          note that disabling cookies will stop you accessing private areas of
          the website.
        </p>
      </div>
    </div>

    <Footer />
  </Layout>
);

export default PrivacyPage;
