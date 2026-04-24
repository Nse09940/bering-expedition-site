import type { ReactNode } from "react";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import Heading from "@theme/Heading";

import styles from "./index.module.css";

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={styles.heroBanner}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link className="button button--primary button--lg" to="/docs/intro">
            Открыть документацию
          </Link>
          <Link
            className="button button--secondary button--lg"
            to="http://localhost:8000/docs"
          >
            FastAPI OpenAPI
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={siteConfig.title}
      description="Техническая документация образовательного сайта об экспедициях Витуса Беринга."
    >
      <HomepageHeader />
      <main className="container margin-vert--xl">
        <div className="row">
          <div className="col col--4">
            <h2>Архитектура</h2>
            <p>
              Описание монорепозитория, связей между Next.js, FastAPI,
              PostgreSQL и MinIO.
            </p>
          </div>
          <div className="col col--4">
            <h2>API</h2>
            <p>
              Эндпоинты, назначение ресурсов и текущий MVP-контур backend-а.
            </p>
          </div>
          <div className="col col--4">
            <h2>Контент</h2>
            <p>
              Контентная модель проекта и правила хранения источников,
              цитирования и медиа.
            </p>
          </div>
        </div>
      </main>
    </Layout>
  );
}
