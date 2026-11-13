import type { Metadata } from "next";
import Image from "next/image";
import BleedImage from "@/components/BleedImage";
import Footer from "@/components/Footer";
import FormHub from "@/components/FormHub";
import Header from "@/components/Header";
import Reveal from "@/components/Reveal";
import StickyCta from "@/components/StickyCta";
import SmartWaiverWidget from "@/components/SmartWaiverWidget";
import TeamOffers from "@/components/TeamOffers";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};

function bookHref(packageId: string) {
  return `/?package=${packageId}#book`;
}

export default function HomePage() {
  return (
    <>
      <a className="skip-link" href="#top">
        Skip to content
      </a>
      <Header />

      <main id="top">
        <section className="hero">
          <BleedImage
            src="/assets/hero.webp"
            alt="Athletes attacking the UHoop in No Backboard Basketball action"
            priority
          />
          <div className="shell hero-top">
            <Image
              src="/assets/logo.png"
              alt=""
              width={144}
              height={144}
              className="hero-logo"
              priority
            />
            <p className="hero-banner">
              <span>World&apos;s First Dedicated No Backboard Basketball Gym</span>
            </p>
          </div>
          <div className="shell hero-copy">
            <h1 className="display">
              The Home of
              <br />
              No Backboard
              <br />
              Basketball
            </h1>
            <p className="hero-tagline">
              Your coach. Your system. Two hours. Measured work.
            </p>
            <div className="hero-meta">
              <div className="location">Gilbert, Arizona</div>
              <div className="opening">NOW OPEN</div>
            </div>
            <div className="hero-actions">
              <a className="btn primary" href="#book">
                Train Your Team →
              </a>
              <a className="btn outline" href="#showcases">
                Explore Showcases →
              </a>
            </div>
          </div>
        </section>

        <section className="section academy-promo" id="academy" aria-labelledby="academy-heading">
          <div className="shell academy-grid">
            <a
              className="academy-flyer"
              href="https://academy.nobackboard.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Register for the No Backboard Shooting & Scoring Academy"
            >
              <Image
                src="/assets/academy-promo.webp"
                alt="No Backboard Basketball Gym Shooting & Scoring Academy Open House, November 19–21. Co-ed, grades 6–9, 90-minute group classes, $30 introductory class. Register now at nobackboard.com/academy."
                width={720}
                height={1280}
                sizes="(max-width: 899px) 90vw, 380px"
              />
            </a>
            <div className="academy-copy">
              <p className="eyebrow academy-kicker">Now enrolling · Grades 6–9</p>
              <h2 className="display academy-title" id="academy-heading">
                Shooting &amp; Scoring
                <br />
                <span className="accent-yellow">Academy</span>
              </h2>
              <p className="lead">
                Train different. Play your game better. Coach Mark Tee
                Armstrong&apos;s 90-minute classes build precision shooting,
                faster decisions and finishing on the 16-inch UHoop, then put it
                to work in a live scrimmage.
              </p>
              <ul className="academy-points">
                <li>
                  <b>Open House, Nov 19–21:</b> a $30 introductory class, with
                  the $30 credited if you join within 7 days.
                </li>
                <li>
                  <b>Classes start Tuesday, Dec 1:</b> Tuesday–Saturday, co-ed,
                  grouped by grade.
                </li>
                <li>
                  <b>Founding Family rates</b> for the first 50 families.
                </li>
              </ul>
              <div className="hero-actions academy-actions">
                <a className="btn primary" href="https://academy.nobackboard.com/" target="_blank" rel="noopener noreferrer">
                  Reserve a $30 Class →
                </a>
                <a className="btn outline" href="https://academy.nobackboard.com/#plans" target="_blank" rel="noopener noreferrer">
                  See Plans →
                </a>
              </div>
              <p className="academy-where">
                Eduprize High School Gym · 1383 E Baseline Rd, Gilbert, AZ 85233
              </p>
            </div>
          </div>
        </section>

        <section className="section intro" id="difference">
          <div className="intro-visual" aria-hidden="true">
            <BleedImage
              src="/assets/finish.webp"
              alt=""
              sizes="(max-width: 1099px) 100vw, 50vw"
            />
          </div>
          <div className="shell intro-copy">
            <Reveal>
              <h2 className="display split-title">
                The Futsal of
                <br />
                Basketball.
              </h2>
            </Reveal>
            <Reveal delay={90}>
              <p className="pillar-stack">
                <span>Swish.</span>
                <span className="accent">Speed.</span>
                <span>Skill.</span>
              </p>
            </Reveal>
            <Reveal delay={140}>
              <p className="lead intro-lead">
                A more demanding basketball environment built to develop better
                shooters, faster decision makers and more skilled basketball
                players.
              </p>
              <a className="text-link" href="#swish">
                Explore the Difference →
              </a>
            </Reveal>
          </div>
        </section>

        <section className="chapter chapter-swish" id="swish">
          <BleedImage
            src="/assets/swish.png"
            alt="Player shooting at the UHoop during live No Backboard Basketball action"
          />
          <div className="chapter-watermark" aria-hidden="true">
            16″
          </div>
          <div className="shell chapter-copy">
            <Reveal>
              <h2 className="display chapter-title">Swish.</h2>
              <p className="chapter-kicker">16 inch UHoop. No backboard.</p>
              <p className="lead on-photo">
                A traditional basketball rim is 18 inches. The UHoop is 16 inches
                with no backboard. There is no bank shot bailout.
              </p>
              <p className="lead on-photo">Players must develop:</p>
              <ul className="word-row">
                <li>Touch</li>
                <li>Arc</li>
                <li>Precision</li>
              </ul>
              <p className="statement">
                Smaller target.
                <br />
                Softer touch.
                <br />
                Cleaner shot.
              </p>
            </Reveal>
          </div>
        </section>

        <section className="chapter chapter-speed" id="speed">
          <BleedImage
            src="/assets/speed.png"
            alt="Athlete dribbling at speed in live No Backboard Basketball play"
          />
          <div className="shell chapter-copy">
            <Reveal>
              <h2 className="display chapter-title">Speed.</h2>
              <p className="chapter-kicker">The game doesn&apos;t stop.</p>
              <p className="lead on-photo">
                The ball stays live after made baskets. There is no waiting
                underneath the basket. There are no timeouts to solve the
                problem. Live substitutions keep the game moving.
              </p>
              <p className="lead on-photo">
                Score and immediately defend. Give up a basket and immediately
                attack.
              </p>
              <ul className="word-list">
                <li>Live ball</li>
                <li>No timeouts</li>
                <li>Live substitutions</li>
                <li>Immediate transition</li>
                <li>Faster decisions</li>
              </ul>
              <p className="statement">
                Train in a faster game.
                <br />
                Make your game feel slower.
              </p>
            </Reveal>
          </div>
        </section>

        <section className="chapter chapter-skill" id="skill">
          <BleedImage
            src="/assets/skill.webp"
            alt="High intensity finish at the UHoop under defensive pressure"
          />
          <div className="shell chapter-copy">
            <Reveal>
              <h2 className="display chapter-title">Skill.</h2>
              <p className="lead on-photo">
                Apply basketball fundamentals under pressure.
              </p>
              <ul className="verb-stack">
                <li>Think.</li>
                <li>Communicate.</li>
                <li>Pass.</li>
                <li>Finish.</li>
                <li>Decide.</li>
              </ul>
              <p className="statement">
                More problem solving.
                <br />
                More decisions.
                <br />
                More basketball.
              </p>
              <a className="btn primary" href="#train">
                Explore Team Development →
              </a>
            </Reveal>
          </div>
        </section>

        <section className="section system-section" id="train">
          <div className="shell">
            <Reveal>
              <h2 className="display section-title">
                Practice Your System.
                <br />
                <span className="accent">Scrimmage Our System.</span>
              </h2>
              <p className="lead">
                Your team. Your coach. Your offense. Your defense. Your
                terminology. Your drills.
              </p>
              <p className="lead">
                NBBL does not replace a team&apos;s basketball program. NBBL adds a
                different basketball environment to it.
              </p>
            </Reveal>
          </div>
          <ol className="system-flow">
            <li>
              <BleedImage
                src="/assets/speed.webp"
                alt="Athlete shooting at the UHoop during a training sequence"
                sizes="100vw"
              />
              <span className="system-index" aria-hidden="true">
                01
              </span>
              <span>Practice your system.</span>
            </li>
            <li>
              <BleedImage
                src="/assets/competition.webp"
                alt="Players competing in No Backboard Basketball"
                sizes="100vw"
              />
              <span className="system-index" aria-hidden="true">
                02
              </span>
              <span>Scrimmage our system.</span>
            </li>
            <li>
              <BleedImage
                src="/assets/attack.webp"
                alt="Player attacking the UHoop at the peak of a finish"
                sizes="100vw"
              />
              <span className="system-index" aria-hidden="true">
                03
              </span>
              <span>Take the benefits back to your game.</span>
            </li>
          </ol>
          <div className="shell system-cta">
            <a className="btn primary" href="#book">
              Book Team Development →
            </a>
          </div>
        </section>

        <section className="section pricing" id="pricing">
          <div className="shell">
            <Reveal>
              <p className="eyebrow">Team development</p>
              <h2 className="display section-title">
                Bring Your Team.
                <br />
                Keep Your Coach.
              </h2>
              <p className="lead">
                Keep your coach and your system. Add a basketball environment
                that challenges your athletes and helps measure their work.
              </p>
            </Reveal>
            <TeamOffers />

            <div className="club-block">
              <h3 className="display club-title">Club Team Training</h3>
              <p className="lead">
                Your club retains its coach, identity and development plan. NBBL
                supplies the UHoop environment and performance development layer.
              </p>
              <div className="offer-more is-open">
                <a className="offer-row" href={bookHref("club-2hr")}>
                  <div>
                    <h3>Two-Hour Team Session</h3>
                    <p>Up to 18 athletes.</p>
                  </div>
                  <strong>
                    $560
                    <span>per team</span>
                  </strong>
                </a>
                <a className="offer-row" href={bookHref("club-2-session")}>
                  <div>
                    <h3>Two Session Development Cycle</h3>
                    <p>Up to 18 athletes.</p>
                  </div>
                  <strong>
                    $1,000
                    <span>per team</span>
                  </strong>
                </a>
                <a className="offer-row" href={bookHref("club-4-session")}>
                  <div>
                    <h3>Four Session Development Cycle</h3>
                    <p>4 two-hour sessions.</p>
                  </div>
                  <strong>$1,900</strong>
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="chapter measure-chapter">
          <BleedImage
            src="/assets/speed.webp"
            alt="Athlete competing at the UHoop in a measurable development environment"
          />
          <div className="shell chapter-copy">
            <Reveal>
              <p className="eyebrow">Roadmap</p>
              <h2 className="display chapter-title measure-title">
                Don&apos;t Just Practice.
                <br />
                Measure the Work.
              </h2>
              <p className="statement">
                See the work.
                <br />
                Track the development.
              </p>
              <p className="lead on-photo">
                NBBL is evolving toward a measurable development environment.
                These capabilities are on the roadmap unless already operational.
              </p>
              <ol className="roadmap">
                <li>Athlete Performance Tracking Vests</li>
                <li>Real time session reporting</li>
                <li>AI vision capture</li>
                <li>Automated clipping</li>
                <li>Personalized athlete clips</li>
                <li>Performance data</li>
                <li>Social media content</li>
                <li>Long term athlete development records</li>
              </ol>
            </Reveal>
          </div>
        </section>

        <section className="chapter chapter-compete" id="showcases">
          <BleedImage
            src="/assets/showcase.webp"
            alt="Club showcase action with referees and the UHoop"
          />
          <div className="shell chapter-copy">
            <Reveal>
              <p className="eyebrow">Competition</p>
              <h2 className="display chapter-title">
                Train Here.
                <br />
                Then Compete Here.
              </h2>
              <p className="chapter-kicker">NBBL Club Team Showcases</p>
              <p className="statement">
                Four clubs.
                <br />
                32 athletes.
                <br />
                One controlled competitive environment.
              </p>
              <p className="lead on-photo">
                Each club: up to 8 athletes.
                <br />
                Club registration: $360.
              </p>
              <a className="btn primary" href="#showcase-experience">
                Explore Showcases →
              </a>
            </Reveal>
          </div>
        </section>

        <section className="section showcase-experience" id="showcase-experience">
          <div className="shell">
            <Reveal>
              <h2 className="display section-title">
                Compete Locally.
                <br />
                Build an Audience.
                <br />
                Fund the Game.
              </h2>
              <p className="lead">
                Four clubs. Up to 8 athletes per club. $360 per club.
              </p>
            </Reveal>
          </div>
          <div className="contrast-pair">
            <figure>
              <BleedImage
                src="/assets/gym-wide.jpg"
                alt="The controlled room inside the NBBL Gilbert gym"
                objectPosition="center 60%"
                sizes="(max-width: 800px) 100vw, 50vw"
              />
              <figcaption>The room in the gym</figcaption>
            </figure>
            <figure>
              <BleedImage
                src="/assets/production.jpg"
                alt="Production setup connecting the game to an audience beyond the gym"
                objectPosition="center 30%"
                sizes="(max-width: 800px) 100vw, 50vw"
              />
              <figcaption>The audience beyond the gym</figcaption>
            </figure>
          </div>
          <div className="shell ppv-block">
            <p className="chapter-kicker">Watch from anywhere.</p>
            <p className="ppv-price">$9.99 PPV</p>
            <p className="lead">Live event access plus limited replay access.</p>
            <a className="btn primary" href="#showcase-register">
              Register Your Club →
            </a>
          </div>
        </section>

        <section className="section audience">
          <div className="audience-layout">
            <div className="shell audience-copy">
              <Reveal>
                <h2 className="display section-title">
                  Play the Game.
                  <br />
                  Build the Audience.
                  <br />
                  Share the Value.
                </h2>
                <p className="lead">
                  Participating clubs can promote the NBBL Showcase livestream to
                  their own communities. The club is helping create the audience
                  around the event.
                </p>
                <ul className="media-stack">
                  <li>Livestream</li>
                  <li>PPV</li>
                  <li>Social media</li>
                  <li>Community</li>
                  <li>Family</li>
                  <li>Supporters</li>
                </ul>
                <ul className="audience-list">
                  <li>Parents</li>
                  <li>Grandparents</li>
                  <li>Family</li>
                  <li>Friends</li>
                  <li>Alumni</li>
                  <li>Supporters</li>
                  <li>Social followers</li>
                </ul>
              </Reveal>
            </div>
            <figure className="audience-visual">
              <BleedImage
                src="/assets/production.jpg"
                alt="NBBL production area connecting the court to an audience beyond the gym"
                objectPosition="center 40%"
                sizes="(max-width: 900px) 100vw, 46vw"
              />
            </figure>
          </div>
        </section>

        <section className="chapter chapter-fund" id="fundraiser">
          <BleedImage
            src="/assets/swish.webp"
            alt="Competitive No Backboard Basketball action at the UHoop"
          />
          <div className="shell chapter-copy">
            <Reveal>
              <h2 className="display fund-title">
                Your Next Fundraiser
                <br />
                Could Be a No Backboard
                <br />
                Basketball Game!
              </h2>
              <p className="lead on-photo">
                Traditional fundraising asks families to buy something. NBBL
                gives them something to watch.
              </p>
              <p className="lead on-photo">
                Your players compete. Your club promotes the event. Family and
                supporters watch remotely. Your club participates in the
                resulting event economics.
              </p>
              <p className="statement fund-statement">
                Basketball becomes
                <br />
                the fundraiser.
              </p>
              <a className="btn primary" href="#fundraiser-inquiry">
                Turn Our Next Game Into a Fundraiser →
              </a>
            </Reveal>
          </div>
        </section>

        <section className="section economics">
          <div className="shell">
            <Reveal>
              <p className="eyebrow">Showcase economics</p>
              <h2 className="display economics-title">
                The people who help create the audience participate in the value
                it creates.
              </h2>
            </Reveal>
            <ol className="econ-flow">
              <li>
                <span>01</span>
                Event
              </li>
              <li>
                <span>02</span>
                Audience
              </li>
              <li>
                <span>03</span>
                Value
              </li>
              <li>
                <span>04</span>
                Shared participation
              </li>
            </ol>
            <div
              className="split-visual"
              role="img"
              aria-label="Showcase economics: 20 percent each to NBBL and four clubs"
            >
              <div className="split-slice">
                <b>20%</b>
                <span>NBBL</span>
              </div>
              <div className="split-slice">
                <b>20%</b>
                <span>Club 1</span>
              </div>
              <div className="split-slice">
                <b>20%</b>
                <span>Club 2</span>
              </div>
              <div className="split-slice">
                <b>20%</b>
                <span>Club 3</span>
              </div>
              <div className="split-slice">
                <b>20%</b>
                <span>Club 4</span>
              </div>
            </div>
          </div>
        </section>

        <section className="section gym" id="gym">
          <div className="shell">
            <Reveal>
              <p className="eyebrow">The facility</p>
              <h2 className="display section-title">Gym #000</h2>
              <p className="chapter-kicker">
                The first physical home of No Backboard Basketball.
              </p>
              <p className="lead">7,000+ square feet. Gilbert, Arizona.</p>
            </Reveal>
          </div>
          <div className="gym-gallery" role="region" aria-label="Facility photography">
            <figure className="gym-shot">
              <BleedImage
                src="/assets/gym-exterior.jpg"
                alt="Exterior of the NBBL Gilbert facility"
                objectPosition="center 62%"
                sizes="(max-width: 800px) 88vw, 40vw"
              />
              <figcaption>Exterior</figcaption>
            </figure>
            <figure className="gym-shot gym-shot-main">
              <BleedImage
                src="/assets/gym-court.jpg"
                alt="Full high school court inside NBBL Gilbert"
                objectPosition="center 50%"
                sizes="(max-width: 800px) 88vw, 50vw"
              />
              <figcaption>Court</figcaption>
            </figure>
            <figure className="gym-shot">
              <BleedImage
                src="/assets/finish.webp"
                alt="The 16 inch UHoop inside the NBBL Gilbert gym"
                sizes="(max-width: 800px) 88vw, 40vw"
              />
              <figcaption>UHoop</figcaption>
            </figure>
            <figure className="gym-shot gym-shot-wide">
              <BleedImage
                src="/assets/gym-wide.jpg"
                alt="Wide view of the NBBL Gilbert gym, stage, and bleachers"
                objectPosition="center 55%"
                sizes="(max-width: 800px) 88vw, 50vw"
              />
              <figcaption>Bleachers and stage</figcaption>
            </figure>
            <figure className="gym-shot">
              <BleedImage
                src="/assets/production.jpg"
                alt="Production Bird's Nest and capture area"
                objectPosition="center 40%"
                sizes="(max-width: 800px) 88vw, 33vw"
              />
              <figcaption>Production area</figcaption>
            </figure>
          </div>
          <div className="shell">
            <ul className="gym-info">
              <li>Exterior</li>
              <li>Court</li>
              <li>UHoop</li>
              <li>Bleachers</li>
              <li>Stage</li>
              <li>Production area</li>
              <li>Classroom</li>
            </ul>
          </div>
        </section>

        <section className="section about-home" id="why">
          <div className="shell">
            <Reveal>
              <p className="eyebrow">About NBBL</p>
              <div className="why-heading">
                <Image
                  src="/assets/nbbl-logo.webp"
                  alt=""
                  width={72}
                  height={72}
                  className="why-logo"
                />
                <h2 className="display section-title">Why NBBL?</h2>
              </div>
              <p className="chapter-kicker">A different game. A different vision.</p>
              <p className="lead">
                NBBL was created to develop a different basketball environment
                built around no backboard play, faster decision making, skill
                development, competition and community.
              </p>
              <p className="lead">
                Gilbert is the first physical home of that vision.
              </p>
            </Reveal>

            <div className="founder-card">
              <div className="founder-photo">
                <BleedImage
                  src="/assets/mark-armstrong.webp"
                  alt="Mark Tee Armstrong, founder of the No Backboard Basketball League"
                  objectPosition="center 18%"
                  sizes="(max-width: 800px) 100vw, 36vw"
                />
              </div>
              <div>
                <p className="eyebrow">Founder</p>
                <h3 className="display founder-name">Mark Tee Armstrong</h3>
                <p className="founder-role">
                  Founder, No Backboard Basketball League
                  <br />
                  Creator of Basketball the Remix
                </p>
                <p className="lead">
                  Mark Tee Armstrong created the No Backboard Basketball concept
                  and continues to lead the vision behind NBBL.
                </p>
              </div>
            </div>

            <Reveal>
              <p className="statement about-home-statement">
                One gym is the beginning.
              </p>
              <p className="lead">
                Gilbert is the first physical home of No Backboard Basketball.
                NBBL is building toward a broader basketball ecosystem connecting
                athletes, coaches, clubs, creators and supporters.
              </p>
              <a
                className="text-link"
                href="https://remixed.nobackboard.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Learn About NBBL →
              </a>
            </Reveal>
          </div>
        </section>

        <section className="chapter chapter-creators" id="creators">
          <BleedImage
            src="/assets/attack.webp"
            alt="NBBL athlete attacking the UHoop, a basketball-first content environment"
          />
          <div className="shell chapter-copy">
            <Reveal>
              <h2 className="display chapter-title">
                Your Content.
                <br />
                Our Court.
              </h2>
              <p className="statement creator-quote">
                Wait.
                <br />
                They&apos;re playing
                <br />
                without a backboard?
              </p>
              <p className="lead on-photo">
                A basketball first environment for basketball video, photography,
                athlete interviews, podcasts, social content, brand activations
                and commercial basketball production.
              </p>
              <p className="statement">
                Use the gym.
                <br />
                Capture the game.
                <br />
                Tell the story.
              </p>
              <a className="btn primary" href="#creator-access">
                Request Creator Access →
              </a>
            </Reveal>
          </div>
        </section>

        <section className="section final" id="contact">
          <div className="shell final-close">
            <Reveal>
              <h2 className="display">Start with your team.</h2>
              <p className="lead centered-lead">
                Bring your coach. Bring your system. Bring your athletes.
                We&apos;ll provide a different basketball environment.
              </p>
              <p className="path">
                <span>Practice differently.</span>
                <span>Compete locally.</span>
                <span>Measure development.</span>
                <span>Build an audience.</span>
                <span>Fund the game.</span>
              </p>
              <div className="hero-actions centered-actions">
                <a className="btn primary" href="#book">
                  Train Your Team →
                </a>
                <a className="btn outline" href="#showcase-register">
                  Register for a Showcase →
                </a>
                <a className="btn outline" href="#creator-access">
                  Request Creator Access →
                </a>
              </div>
            </Reveal>
          </div>

          <div className="form-wrap">
            <div className="shell">
              <h2 className="display form-heading">Ready to get started?</h2>
              <FormHub />
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <StickyCta />
      <SmartWaiverWidget />
    </>
  );
}
