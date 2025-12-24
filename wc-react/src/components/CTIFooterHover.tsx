import React, { useState, useCallback } from "react";
// import { Button_raw } from ;
interface DropdownItem {
  label: string;
  href: string;
}

export interface CTIFooterHoverProps {
  hoverLabel?: string;
  dropdownItems?: DropdownItem[];
}
declare global {
  interface Window {
    CTI?: { components?: Record<string, any> };
  }
}

export const CTIFooterHover: React.FC<CTIFooterHoverProps> = ({
  hoverLabel = "Menu",
  dropdownItems = [],
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const ButtonRaw = window?.CTI?.components?.Button_raw; // ✅ از window

  const handleMouseEnter = useCallback(() => {
    setIsOpen(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <div style={styles.host}>
      <style>{`
        .wrap {
          position: relative;
          width: 100%;
          padding: 14px 16px;
          border-top: 1px solid rgba(157, 14, 14, 0.08);
          background: var(--footer-bg, #fff);
          color: var(--footer-text, #111827);
        }

        .row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .brand {
          font-weight: 600;
          letter-spacing: 0.2px;
          opacity: 0.9;
        }

        .btn {
          all: unset;
          cursor: pointer;
          user-select: none;
          padding: 10px 12px;
          border-radius: 10px;
          border: 1px solid rgba(230, 222, 222, 0.14);
          background: var(--footer-btn-bg, #111827);
          color: var(--footer-btn-text, #ffffff);
          font-weight: 600;
          line-height: 1;
        }
        .btn:hover { opacity: 0.92; }

        .hoverArea {
          position: relative;

        }

        .dropdown {
          position: absolute;
          right: 0;
          top: calc(100% + 8px);
          min-width: 220px;
          padding: 8px;
          border-radius: 12px;
          border: 1px solid rgba(0,0,0,0.12);
          background: #fff;
          box-shadow: 0 10px 30px rgba(0,0,0,0.12);
          display: none;
          z-index: 50;
        }

        .dropdown.open { display: block; 
          top:-5px;
          transition:0.5s;}

        .item {
          display: block;
          padding: 10px 10px;
          border-radius: 10px;
          text-decoration: none;
          color: #111827;
          font-weight: 600;
          font-size: 14px;
          transition: background 0.2s;
        }
        .item:hover { background: rgba(0,0,0,0.06); }

        .empty {
          opacity: 0.6;
          cursor: default;
        }

        @media (max-width: 520px) {
          .row { flex-direction: column; align-items: stretch; }
          .btn { width: 100%; text-align: center; }
          .dropdown { left: 0; right: 0; min-width: unset; }
        }
      `}</style>

      <div className="wrap">
        <div className="row">
          <div className="brand">CTI Footer</div>
          <div
            className="hoverArea"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}>
            <button className="btn">{hoverLabel}</button>
            <div className={`dropdown ${isOpen ? "open" : ""}`}>
              {dropdownItems.length ? (
                dropdownItems.map((item, idx) => (
                  <a key={idx} className="item" href={item.href || "#"}>
                    {item.label || "Item"}
                  </a>
                ))
              ) : (
                <div className="item empty">No items</div>
              )}
            </div>
          </div>
        </div>
        {ButtonRaw ? <ButtonRaw /> : null}
        
      </div>
    </div>
  );
};

const styles = {
  host: {
    display: "block",
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
  },
};
