import React, { useState, useCallback } from "react";

export interface CTIFooterModalProps {
  buttonText?: string;
  modalTitle?: string;
  modalBody?: string;
}

export const CTIFooterModal: React.FC<CTIFooterModalProps> = ({
  buttonText = "Open",
  modalTitle = "Title",
  modalBody = "Content",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const Title = window?.CTI?.components?.TitleComp; // ✅ از window

  const toggleOpen = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleOverlayClick = useCallback(() => {
    close();
  }, [close]);

  const escapeHtml = (str: string): string => {
    const map: { [key: string]: string } = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
    };
    return String(str ?? "").replace(/[&<>]/g, (char) => map[char]);
  };

  return (
    <div className="cti-footer-modal">
      <style>{`
        :host {
          display: block;
          font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
        }

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

        .overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.48);
          display: none;
          z-index: 60;
        }
        .overlay.open { display: block; }

        .modal {
          position: fixed;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          width: min(520px, calc(100% - 24px));
          background: #fff;
          border-radius: 16px;
          border: 1px solid rgba(0,0,0,0.12);
          box-shadow: 0 20px 60px rgba(0,0,0,0.22);
          padding: 16px;
          display: none;
          z-index: 61;
        }
        .modal.open { display: block; }

        .modalTop {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding-bottom: 10px;
          border-bottom: 1px solid rgba(0,0,0,0.08);
        }

        .title {
          font-weight: 800;
          font-size: 16px;
        }

        .close {
          all: unset;
          cursor: pointer;
          padding: 8px 10px;
          border-radius: 10px;
          border: 1px solid rgba(0,0,0,0.12);
          font-weight: 700;
        }
        .close:hover { background: rgba(0,0,0,0.06); }

        .body {
          padding-top: 12px;
          line-height: 1.6;
          font-size: 14px;
          color: rgba(17,24,39,0.92);
          white-space: pre-wrap;
        }

        @media (max-width: 520px) {
          .row { flex-direction: column; align-items: stretch; }
          .btn { width: 100%; text-align: center; }
        }
      `}</style>

      <div className="wrap">
        <div className="row">
          {Title ? <Title /> : null}
          <div className="brand">CTI Footer</div>
          <button className="btn" onClick={toggleOpen}>
            {buttonText}
          </button>
        </div>
      </div>

      <div
        className={`overlay ${isOpen ? "open" : ""}`}
        onClick={handleOverlayClick}
      />
      <div className={`modal ${isOpen ? "open" : ""}`}>
        <div className="modalTop">
          <div className="title">{modalTitle}</div>
          <button className="close" onClick={close}>
            Close
          </button>
        </div>
        <div
          className="body"
          dangerouslySetInnerHTML={{ __html: escapeHtml(modalBody) }}
        />
      </div>
    </div>
  );
};
