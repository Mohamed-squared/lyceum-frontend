import React from "react";
import styles from "./dashboard.module.css";
import TestGenSnapshotCard from "./TestGenSnapshotCard";
import CoursesSnapshotCard from "./CoursesSnapshotCard";
import InspirationalQuoteCard from "./InspirationalQuoteCard";
import LyceumNewsCard from "./LyceumNewsCard";
import QuickLinksCard from "./QuickLinksCard";

export const Dashboard = () => {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Dashboard</h1>
      </header>
      <main className={styles.main}>
        <p>Welcome to your dashboard!</p>
        <div className={styles.quickLinksContainer}>
          <QuickLinksCard />
        </div>
        <div className={styles.cards}>
          <TestGenSnapshotCard />
          <CoursesSnapshotCard />
        </div>
        <div className={styles.quoteCardContainer}>
          <InspirationalQuoteCard />
        </div>
        <div className={styles.newsCardContainer}>
          <LyceumNewsCard />
        </div>
      </main>
    </div>
  );
};
