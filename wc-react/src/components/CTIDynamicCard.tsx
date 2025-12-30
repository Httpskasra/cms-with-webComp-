import React from "react";

export interface CTIDynamicCardProps {
  title?: string;
  subtitle?: string;
  description?: string;
  primaryButtonText?: string;
  primaryButtonHref?: string;
  secondaryButtonText?: string;
  secondaryButtonHref?: string;
  imageUrl?: string;
  imageAlt?: string;
  badge?: string;
  styles?: {
    container?: React.CSSProperties;
    card?: React.CSSProperties;
    image?: React.CSSProperties;
    badge?: React.CSSProperties;
    title?: React.CSSProperties;
    subtitle?: React.CSSProperties;
    description?: React.CSSProperties;
    buttonsContainer?: React.CSSProperties;
    primaryButton?: React.CSSProperties;
    secondaryButton?: React.CSSProperties;
  };
}

export const CTIDynamicCard: React.FC<CTIDynamicCardProps> = ({
  title = "Dynamic Card",
  subtitle = "",
  description = "This is a fully dynamic card component with customizable content and styles.",
  primaryButtonText = "Primary Action",
  primaryButtonHref = "#",
  secondaryButtonText = "Secondary Action",
  secondaryButtonHref = "#",
  imageUrl = "",
  imageAlt = "Card image",
  badge = "",
  styles = {},
}) => {
  return (
    <div className="cti-dynamic-card" style={styles.container}>
      <style>{`
        .cti-dynamic-card {
          display: block;
          width: 100%;
        }
        .cti-dynamic-card .card-wrap {
          position: relative;
          background: #ffffff;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }
        .cti-dynamic-card .badge {
          position: absolute;
          top: 16px;
          right: 16px;
          background: #3b82f6;
          color: #ffffff;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
          z-index: 1;
        }
        .cti-dynamic-card .image-container {
          width: 100%;
          margin-bottom: 16px;
          border-radius: 8px;
          overflow: hidden;
        }
        .cti-dynamic-card .card-image {
          width: 100%;
          height: auto;
          display: block;
          object-fit: cover;
        }
        .cti-dynamic-card .content {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .cti-dynamic-card .title {
          margin: 0;
          font-size: 24px;
          font-weight: 700;
          line-height: 1.2;
          color: #111827;
        }
        .cti-dynamic-card .subtitle {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
          line-height: 1.3;
          color: #6b7280;
        }
        .cti-dynamic-card .description {
          margin: 0;
          font-size: 14px;
          line-height: 1.6;
          color: #4b5563;
        }
        .cti-dynamic-card .buttons {
          display: flex;
          gap: 12px;
          margin-top: 8px;
          flex-wrap: wrap;
        }
        .cti-dynamic-card .btn {
          display: inline-block;
          padding: 10px 20px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.2s;
          cursor: pointer;
        }
        .cti-dynamic-card .btn-primary {
          background: #3b82f6;
          color: #ffffff;
        }
        .cti-dynamic-card .btn-primary:hover {
          background: #2563eb;
          opacity: 0.9;
        }
        .cti-dynamic-card .btn-secondary {
          background: #e5e7eb;
          color: #111827;
        }
        .cti-dynamic-card .btn-secondary:hover {
          background: #d1d5db;
          opacity: 0.9;
        }
      `}</style>
      <div className="card-wrap" style={styles.card}>
        {badge && (
          <div className="badge" style={styles.badge}>
            {badge}
          </div>
        )}

        {imageUrl && (
          <div className="image-container">
            <img
              src={imageUrl}
              alt={imageAlt}
              className="card-image"
              style={styles.image}
            />
          </div>
        )}

        <div className="content">
          {title && (
            <h2 className="title" style={styles.title}>
              {title}
            </h2>
          )}

          {subtitle && (
            <h3 className="subtitle" style={styles.subtitle}>
              {subtitle}
            </h3>
          )}

          {description && (
            <p className="description" style={styles.description}>
              {description}
            </p>
          )}

          {(primaryButtonText || secondaryButtonText) && (
            <div className="buttons" style={styles.buttonsContainer}>
              {primaryButtonText && (
                <a
                  href={primaryButtonHref}
                  className="btn btn-primary"
                  style={styles.primaryButton}
                  target="_blank"
                  rel="noreferrer">
                  {primaryButtonText}
                </a>
              )}
              {secondaryButtonText && (
                <a
                  href={secondaryButtonHref}
                  className="btn btn-secondary"
                  style={styles.secondaryButton}
                  target="_blank"
                  rel="noreferrer">
                  {secondaryButtonText}
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
