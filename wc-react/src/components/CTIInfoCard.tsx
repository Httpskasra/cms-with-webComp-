import React from "react";

export interface CTIInfoCardProps {
  title?: string;
  description?: string;
  ctaText?: string;
  ctaHref?: string;
  styles?: {
    card?: React.CSSProperties;
    title?: React.CSSProperties;
    description?: React.CSSProperties;
    cta?: React.CSSProperties;
  };
}

export const CTIInfoCard: React.FC<CTIInfoCardProps> = ({
  title = "Info Card",
  description = "This is a reusable info card web component.",
  ctaText = "Learn more",
  ctaHref = "#",
  styles = {},
}) => {
  return (
    <div className="cti-info-card">
      <div className="wrap" style={styles.card}>
        <h3 className="title" style={styles.title}>
          {title}
        </h3>
        <p className="desc" style={styles.description}>
          {description}
        </p>
        <a
          className="cta"
          href={ctaHref}
          target="_blank"
          rel="noreferrer"
          style={styles.cta}>
          {ctaText}
          <span aria-hidden="true">→</span>
        </a>
      </div>
    </div>
  );
};
