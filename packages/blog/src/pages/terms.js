import React from "react";
import Layout from "../components/layout";
import Header from "../components/header";
import Footer from "../components/footer";

const TermsPage = () => (
  <Layout>
    <div className="main-background">
      <Header />

      <div className="container">
        <h2>Terms of Service</h2>
        <h3>Subject matter</h3>
        <p>
          The subject matter of this Agreement is the use of Dependabot. This
          Agreement regulates all relations between Dependabot and the customer
          regarding the use of Dependabot.
        </p>
        <p>
          Dependabot communicates with the GitHub hosting service which is
          offered by GitHub Inc. on the customer’s behalf. Condition to the
          proper use of Dependabot is a valid contract with GitHub Inc. on the
          use of GitHub which may lead to costs on the customer’s sole
          responsibility. The customer will provide Dependabot with his GitHub
          account information (hereinafter “GitHub Sign-In”) when signing in
          through GitHub via dependabot.com (hereinafter the “Website”)
          automatically. He allows Dependabot to access the customer’s GitHub
          account. Dependabot will directly communicate in the name of the
          customer and in its own name with GitHub, and the customer authorizes
          Dependabot to act on his behalf towards GitHub Inc. The customer is
          solely liable for any costs or damages that GitHub Inc. associates
          with the GitHub Sign-In.
        </p>
        <h3>Service specification</h3>
        <p>
          Dependabot provides an online, automated dependency management
          service. It is integrated with GitHub and offers support for several
          programming languages.
        </p>
        <p>
          To perform its automated dependency management service, Dependabot
          will access the customer's GitHub account on the customer's behalf.
          Dependabot will download the files required to check and update the
          dependencies on a GitHub repository specified by the customer, and
          will create new commits containing the updated files. Dependabot will
          never store details of the customer's code, except as required to make
          the aforementioned updates, and new commits will only ever be pushed
          to branches namespaced for use by Dependabot. As such, Dependabot will
          never make updates directly to your master or default branches.
        </p>
        <p>
          No consultancy, training, trouble shooting or support is within the
          scope of the services offered by Dependabot under this Agreement.
        </p>
        <h3>Concluding of the Agreement</h3>
        <p>
          Using Dependabot requires the opening of an Account at{" "}
          <a href="https://dependabot.com">https://dependabot.com</a> by using
          the customer’s GitHub Sign-In. Dependabot will conclude Agreements on
          the use of Dependabot only with GitHub users.
        </p>
        <p>
          The opening of an Account by the customer is deemed an offer to
          conclude this agreement. Dependabot may at its own discretion accept
          this offer by explicitly accepting it or rendering services under this
          agreement.
        </p>
        <p>
          An Account may only be used by one single person. The customer is
          entitled to create separate Accounts for his employees.
        </p>
        <p>
          The person opening the account represents that he/she has got the
          legal authority to bind the legal entity he/she acts for to this
          Agreement and may in knowledge of this agreement provide the GitHub
          Sign-Ins to Dependabot.
        </p>
        <p>In connection with the registration the customer is obliged to</p>
        <ul>
          <li>
            keep Account Data confidential at all times and to do everything to
            avoid any third party getting hold of the data. In this respect
            ‘third party’ also includes all employees of the customer that are
            not designated to use Dependabot;
          </li>

          <li>
            immediately inform Dependabot in case of loss, theft or other
            disclosure of the Account Data to a third party or in a suspicion of
            misuse of the Account Data and to immediately change the password;
          </li>

          <li>
            allow the use of the Account Data only designated administrators to
            be specified in the registration procedure.
          </li>
        </ul>
        <h3>Obligations of the customer</h3>
        <p>
          If you choose a paid plan, you agree to pay us fees. Details of those
          fees are set out in the pricing section at{" "}
          <a href="https://dependabot.com">https://dependabot.com</a>. Our fees
          will be collected automatically as part of your payments to GitHub for
          their marketplace services.
        </p>
        <p>
          You must not interfere or intend to interfere in any manner with the
          functionality or proper working of Dependabot.
        </p>
        <p>
          You will indemnify and hold harmless Dependabot, its officers and
          directors, employees and agents from any and all third party claims,
          damages, costs and (including reasonable attorneys fees) arising out
          of your use of Dependabot in a manner not authorized by this
          Agreement, and/or applicable law.
        </p>
        <h3>Warranty</h3>
        <p>
          Dependabot undertakes that the service will be performed substantially
          in accordance with the service specification and with reasonable skill
          and care. In the event that the services do not conform with such
          warranty, Dependabot will use all reasonable commercial endeavours to
          correct such non-performance or provide the customer with an
          alternative means of accomplishing the desired performance.
        </p>
        <p>
          Defects in the supplied Software shall be remediated within a
          reasonable time following a detailed notification of such defect being
          given to Dependabot by the customer.
        </p>
        <p>
          Dependabot warrants that the software is free from viruses and
          defects, and does not contain any malicious code. Dependabot further
          warrants that the customer's use of the service/software will not
          infringe the intellectual property rights of a third party.
        </p>
        <p>
          Dependabot warrants that it will comply with all applicable laws,
          statutes, regulations and codes from time to time in force.
        </p>
        <h3>Downtime and services suspensions</h3>
        <p>
          Adjustments, changes and updates of Dependabot that help to avoid or
          maintain dysfunctions of the software may lead to temporary service
          suspensions. Dependabot will try to limit downtime of the service or
          restrictions of accessibility to 10 hours a month.
        </p>
        <p>
          The customer is aware that the service relies on a working internet
          infrastructure. Additional downtime of the service can occur, if the
          website is not available and at any other time with restrictive access
          to the internet.
        </p>
        <p>
          The customer is aware that Dependabot does not work if GitHub is not
          properly available (be it to Dependabot or the customer).
        </p>
        <h3>Rights to use</h3>
        <p>
          The customer is granted a limited, non-exclusive, non-transferable,
          non-sublicenseable right to use Dependabot as software as a service
          via the internet.
        </p>
        <p>
          The customer is not granted any additional right to the Software or
          any other intellectual property of Dependabot. This especially means
          that the customer shall not be entitled to make copies of the
          Software. The customer shall not translate the program code into other
          forms of code (decompilation) or employ other methods aimed at
          revealing the Software’s code in the various stages of its development
          (reverse engineering).
        </p>
        <p>
          The customer is not entitled to remove or make alterations to
          copyright notices, serial numbers or other features which serve to
          identify the Software.
        </p>
        <h3>Limitation of liability</h3>
        <p>
          To the maximum extent permitted by applicable law, Dependabot and its
          officers, employees and agents will not be liable for any indirect,
          incidental, special, consequential or punitive damages including,
          without limitation, loss of profits, data, use, good will or other
          intangible losses resulting from your access to and use of (or
          inability to access and use) the service.
        </p>
        <p>
          In no event shall Dependabot's total liability to you for any damages
          resulting from any claim or series of related claims exceed the amount
          paid by you for the service within the 12 months preceding any claim
          or series of claims.
        </p>
        <p>
          Likewise, in no event shall your total liability to Dependabot for any
          damages exceed the amount paid by you for the service within the 12
          months preceding any claim or series of claims.
        </p>
        <p>
          Dependabot will indemnify, defend and hold harmless the customer, its
          affiliates and its and their officers, directors, employees, agents
          and subcontractors (“Indemnitees”) against all claims, demands, suits,
          liabilities, costs, expenses (including reasonable legal fees),
          damages and losses suffered or incurred by the Indemnitees arising out
          of or in connection with Dependabot’s negligent performance or
          non-performance of this agreement, or any actual or alleged
          infringement of a third party’s intellectual property rights arising
          out of the customer’s use of the service supplied by Dependabot or the
          Software.
        </p>
        <h3>Confidentiality</h3>
        <p>
          Each party undertakes that it will not at any time hereafter use,
          divulge or communicate to any person, except to its professional
          representatives or advisers or as may be required by law or any legal
          or regulatory authority, any confidential information concerning the
          business or affairs of the other party which may have or may in future
          come to its knowledge and each of the parties shall use its reasonable
          endeavours to prevent the publication or disclosure of any
          confidential information concerning such matters.
        </p>
        <h3>Data protection</h3>
        <p>
          Dependabot stores Account Data, GitHub Sign-Ins and user information
          about the customer. This data may be shared with third parties if
          those are assigned by Dependabot to handle internal processes.
        </p>
        <p>
          Dependabot uses web tracking to store and analyze the customer’s
          interacting with the Website. The customer agrees to this form of
          monitoring, tracking and storage. Dependabot may also store monitoring
          and statistical data about the customer’s usage of Dependabot and
          GitHub and information about the dependencies updated. These data may
          be – anonymized – published by Dependabot to the public.
        </p>
        <p>
          Dependabot may inform the public about the customer using Dependabot
          and Dependabot’s services including a rough description of the usage
          for marketing and public relation purposes. The customer agrees to
          appear in Dependabot's reference lists including any name, trademark
          or logo of the customer. This includes, but is not limited to,
          descriptions on the Website, any other Dependabot websites,
          presentations, presentation material, and press announcements. The
          customer may opt out of being included in any/all such promotional
          material by contacting Dependabot at any time.
        </p>
        <h3>Term and Termination</h3>
        <p>
          The Agreement runs for an indefinite time and will remain in effect
          until terminated by one of Parties in accordance with this section.
        </p>

        <p>
          The Parties may terminate this Agreement for any or no reason at their
          convenience at any time. Termination may be issued in writing or by
          using the provided account closing mechanism, if provided by
          Dependabot.
        </p>
        <p>
          No notice period is required for either party to terminate this
          Agreement.
        </p>

        <h3>Law</h3>
        <p>
          Our relationship with you is governed by English law and the English
          courts shall have exclusive jurisdiction over any disputes relating or
          connected to it.
        </p>
        <h3>Resolving disputes</h3>
        <p>
          Should you have any concerns or complaints about the service we
          provide, please contact us in the first instance using any of the
          methods set out on the Dependabot website. We will work with you in
          order to understand your issue and work towards a swift resolution.
        </p>
        <h3>Notices</h3>
        <p>
          Any notice or other communication required to be given to a party
          under or in connection with this contract shall be sent by e-mail to
          the email-address registered by you with GitHub, or to any updated
          email-address you provide.
        </p>
        <p>
          Notices to Dependabot must be directed to{" "}
          <a href="mailto:support@dependabot.com">support@dependabot.com</a>.
        </p>

        <h3>Final provisions</h3>
        <p>
          This agreement, together with any documents referred to in it, or
          expressed to be entered into in connection with it, constitutes the
          whole agreement between the Parties concerning the subject matter of
          this Agreement.
        </p>
        <p>
          The customer may set off only legally, binding and recognized claims.
          The rights and obligations arising from this Agreement are generally
          not transferable. However Dependabot may transfer this Agreement with
          all rights and obligations to a company of its choice.
        </p>
        <p>
          If any provision of this agreement is or later becomes invalid, or
          contains omissions, the validity of the other provisions shall remain
          unaffected. The parties shall agree upon a new provision, which shall
          resemble the invalid provision as closely as possible in purpose and
          meaning considering the interests of the parties and the legal
          regulations, to replace the invalid provision. In the event of an
          omission in the agreement, a provision shall be agreed upon which
          shall correspond with that which would have been agreed, pursuant to
          the purpose and meaning of the agreement, if the matter had been
          considered by the parties when the agreement was formed.
        </p>
        <p>
          These General Terms and Conditions may be modified by Dependabot at
          any time.
        </p>
      </div>
    </div>

    <Footer />
  </Layout>
);

export default TermsPage;
