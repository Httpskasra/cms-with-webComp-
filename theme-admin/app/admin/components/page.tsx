"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ComponentRegistry, getAdminManifest } from "@/src/lib/manifestClient";

export default function ComponentsPage() {
  const [components, setComponents] = useState<ComponentRegistry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getAdminManifest()
      .then((manifest) => {
        setComponents(manifest.registry);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const filtered = components.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.id.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="p-8">Loading components...</div>;
  if (error) return <div className="p-8 text-red-600">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto p-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Component Catalog
          </h1>
          <p className="text-lg text-slate-600">
            Edit, preview, and publish Web Components with live styling updates.
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search components..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-6 py-3 rounded-lg border border-slate-300 bg-white shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
          />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((component) => (
            <Link key={component.id} href={`/admin/components/${component.id}`}>
              <div className="h-full bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 cursor-pointer border border-slate-200 hover:border-indigo-400 hover:-translate-y-1">
                <div className="mb-4">
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">
                    {component.name}
                  </h2>
                  <p className="text-sm text-slate-500 font-mono bg-slate-50 px-3 py-1 rounded w-fit">
                    {component.id}
                  </p>
                </div>

                <p className="text-slate-600 mb-4 text-sm">
                  {component.description}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                  <div className="text-xs text-slate-500">
                    <span className="font-semibold text-slate-700">
                      {component.props.length}
                    </span>{" "}
                    props •{" "}
                    <span className="font-semibold text-slate-700">
                      {component.cssVars.length}
                    </span>{" "}
                    CSS vars
                  </div>
                  <div className="text-indigo-600 font-semibold text-sm">
                    Edit →
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-500 text-lg">No components found</p>
          </div>
        )}
      </div>
    </div>
  );
}
