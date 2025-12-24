// components/admin/ComponentDocs.tsx

"use client";

import { ComponentDoc } from "@/lib/manifestClient";

interface ComponentDocsProps {
  docs: ComponentDoc;
}

export default function ComponentDocs({ docs }: ComponentDocsProps) {
  return (
    <div className="max-w-4xl space-y-8">
      {docs.overview && (
        <section>
          <h2 className="text-2xl font-bold mb-4">Overview</h2>
          <p className="text-slate-600 leading-relaxed">{docs.overview}</p>
        </section>
      )}

      {docs.usage && (
        <section>
          <h2 className="text-2xl font-bold mb-4">Basic Usage</h2>
          <pre className="bg-slate-800 text-slate-100 p-6 rounded-lg overflow-x-auto">
            <code>{docs.usage}</code>
          </pre>
        </section>
      )}

      {docs.examples && docs.examples.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-4">Examples</h2>
          <div className="space-y-6">
            {docs.examples.map((example, idx) => (
              <div key={idx} className="border border-slate-200 rounded-lg p-6">
                <h3 className="font-semibold text-lg mb-3">{example.title}</h3>
                <pre className="bg-slate-800 text-slate-100 p-4 rounded overflow-x-auto text-xs">
                  <code>{example.code}</code>
                </pre>
              </div>
            ))}
          </div>
        </section>
      )}

      {docs.accessibility && (
        <section>
          <h2 className="text-2xl font-bold mb-4">Accessibility</h2>
          <p className="text-slate-600 leading-relaxed">{docs.accessibility}</p>
        </section>
      )}

      {docs.browserSupport && (
        <section>
          <h2 className="text-2xl font-bold mb-4">Browser Support</h2>
          <p className="text-slate-600 leading-relaxed">
            {docs.browserSupport}
          </p>
        </section>
      )}

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
        <p className="text-sm text-amber-900">
          ℹ️ <strong>Admin Only:</strong> This documentation is visible only in
          the Admin interface and is never sent to clients.
        </p>
      </div>
    </div>
  );
}
