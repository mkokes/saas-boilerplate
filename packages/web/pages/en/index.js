const React = require("react");

const CompLibrary = require("../../core/CompLibrary.js");

const MarkdownBlock = CompLibrary.MarkdownBlock; /* Used to read markdown */
const Container = CompLibrary.Container;
const GridBlock = CompLibrary.GridBlock;

class HomeSplash extends React.Component {
  render() {
    const { siteConfig, language = "" } = this.props;
    const { baseUrl, appUrl, docsUrl } = siteConfig;
    const docsPart = `${docsUrl ? `${docsUrl}/` : ""}`;
    const langPart = `${language ? `${language}/` : ""}`;
    const docUrl = doc => `${baseUrl}${docsPart}${langPart}${doc}`;

    const SplashContainer = props => (
      <div className="homeContainer">
        <div className="homeSplashFade">
          <div className="wrapper homeWrapper">{props.children}</div>
        </div>
      </div>
    );

    const ProjectTitle = () => (
      <h1 className="projectTitle">
        <img
          alt="Docusaurus with Keytar"
          className="index-hero-logo"
          src="/img/hero-logo.svg"
          width="130px"
        />
        Fast and Open Source
        <small>Data storage for React Native</small>
      </h1>
    );

    const PromoSection = props => (
      <div className="section promoSection">
        <div className="promoRow">
          <div className="pluginRowBlock">{props.children}</div>
        </div>
      </div>
    );

    const Button = props => (
      <div className="pluginWrapper buttonWrapper">
        <a className="button hero" href={props.href} target={props.target}>
          {props.children}
        </a>
      </div>
    );

    return (
      <SplashContainer>
        <div className="inner">
          <ProjectTitle />
          <PromoSection>
            <Button href={`${appUrl}/signup`}>GET STARTED</Button>
          </PromoSection>
        </div>
      </SplashContainer>
    );
  }
}

class Index extends React.Component {
  render() {
    const { config: siteConfig, language = "" } = this.props;
    const { baseUrl } = siteConfig;

    const Block = props => (
      <Container
        padding={["bottom", "top"]}
        id={props.id}
        background={props.background}
      >
        <GridBlock
          align="center"
          contents={props.children}
          layout={props.layout}
        />
      </Container>
    );

    const FeatureCallout = () => (
      <div
        className="productShowcaseSection paddingBottom"
        style={{ textAlign: "center" }}
      >
        <h2>Feature Callout</h2>
        <MarkdownBlock>These are features of this project</MarkdownBlock>
      </div>
    );

    const TryOut = () => (
      <Block id="try">
        {[
          {
            content: "Talk about trying this out",
            image: `${baseUrl}img/docusaurus.svg`,
            imageAlign: "left",
            title: "Try it Out"
          }
        ]}
      </Block>
    );

    const Description = () => (
      <Block background="dark">
        {[
          {
            content:
              "This is another description of how this project is useful",
            image: `${baseUrl}img/docusaurus.svg`,
            imageAlign: "right",
            title: "Description"
          }
        ]}
      </Block>
    );

    const LearnHow = () => (
      <Block background="light">
        {[
          {
            content: "Talk about learning how to use this",
            image: `${baseUrl}img/docusaurus.svg`,
            imageAlign: "right",
            title: "Learn How"
          }
        ]}
      </Block>
    );

    const Features = () => (
      <Block layout="fourColumn" background="light">
        {[
          {
            content: "Integrate services using serverless functions and APIs",
            image: `${baseUrl}img/homepage/features/1.svg`,
            imageAlign: "top",
            title: "Feature One"
          },
          {
            content: "Serverless webs, contact forms, and applications",
            image: `${baseUrl}img/homepage/features/2.svg`,
            imageAlign: "top",
            title: "Feature Two"
          },
          {
            content: "A React single-page app with a serverless backend API",
            image: `${baseUrl}img/homepage/features/3.svg`,
            imageAlign: "top",
            title: "Feature Two"
          },
          {
            content:
              "Hook into the server or client lifecycle with the help of extensions. Use middlewares or the validation library of your choice.",
            image: `${baseUrl}img/homepage/features/4.svg`,
            imageAlign: "top",
            title: "Feature Two"
          }
        ]}
      </Block>
    );

    const Showcase = () => {
      if ((siteConfig.users || []).length === 0) {
        return null;
      }

      const showcase = siteConfig.users
        .filter(user => user.pinned)
        .map(user => (
          <a href={user.infoLink} key={user.infoLink}>
            <img src={user.image} alt={user.caption} title={user.caption} />
          </a>
        ));

      return (
        <div className="productShowcaseSection paddingBottom">
          <h2>Who is Using This?</h2>
          <p>This project is used by all these people</p>
          <div className="logos">{showcase}</div>
        </div>
      );
    };

    return (
      <div>
        <HomeSplash siteConfig={siteConfig} language={language} />
        <div className="mainContainer">
          <Container background="light">
            <Features />
          </Container>
          <Container>
            <GridBlock
              contents={[
                {
                  content: `Get [up and running](${siteConfig.baseUrl}docs/${
                    this.props.language
                  }/site-creation)
                    quickly without having to worry about site design.`,
                  imageAlign: "right",
                  image: `https://docusaurus.io/img/docusaurus_speed.svg`,
                  imageAlt: "Docusaurus on a Scooter",
                  title: "Quick Setup"
                }
              ]}
              layout="twoColumn"
            />
          </Container>
          <Container padding={["bottom", "top"]} background="light">
            <GridBlock
              contents={[
                {
                  content: `Make design and documentation changes by using the included
                    [live server](${siteConfig.baseUrl}docs/${
                    this.props.language
                  }/site-preparation#verifying-installation).
                    [Publish](${siteConfig.baseUrl}docs/${
                    this.props.language
                  }/publishing)
                    your site to GitHub pages or other static file hosts
                    manually, using a script, or with continuous integration
                    like CircleCI.`,
                  imageAlign: "left",
                  image: `https://docusaurus.io/img/docusaurus_live.gif`,
                  imageAlt: "Docusaurus Demo",
                  title: "Develop and Deploy"
                }
              ]}
              layout="twoColumn"
            />
          </Container>
          <Container className="productShowcaseSection">
            <Showcase />
          </Container>
        </div>
      </div>
    );
  }
}

module.exports = Index;
