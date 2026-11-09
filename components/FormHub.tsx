"use client";

import { useEffect, useState } from "react";
import AcademyForm from "./forms/AcademyForm";
import CreatorForm from "./forms/CreatorForm";
import FundraiserForm from "./forms/FundraiserForm";
import SessionForm from "./forms/SessionForm";
import ShowcaseForm from "./forms/ShowcaseForm";

export type FormTab =
  | "book"
  | "showcase-register"
  | "creator-access"
  | "fundraiser-inquiry"
  | "academy-interest";

const TABS: Array<{ id: FormTab; label: string }> = [
  { id: "book", label: "Book Sessions" },
  { id: "showcase-register", label: "Register Showcase" },
  { id: "academy-interest", label: "Academy Interest" },
  { id: "creator-access", label: "Creator Access" },
  { id: "fundraiser-inquiry", label: "Fundraiser Inquiry" },
];

function tabFromHash(hash: string): FormTab | null {
  const value = hash.replace("#", "");
  return TABS.some((tab) => tab.id === value) ? (value as FormTab) : null;
}

function scrollToForm() {
  const tab = tabFromHash(window.location.hash);
  const target = document.getElementById(tab ?? "form-hub");
  target?.scrollIntoView({ behavior: "smooth" });
}

export default function FormHub() {
  const [activeTab, setActiveTab] = useState<FormTab>("book");
  const [initialPackageId, setInitialPackageId] = useState<string | undefined>();

  useEffect(() => {
    const syncFromLocation = (shouldScroll: boolean) => {
      const tab = tabFromHash(window.location.hash);
      if (tab) {
        setActiveTab(tab);
        if (shouldScroll) {
          scrollToForm();
        }
      }
      const params = new URLSearchParams(window.location.search);
      setInitialPackageId(params.get("package") ?? undefined);
    };

    const hashIsFormTab = Boolean(tabFromHash(window.location.hash));
    syncFromLocation(false);

    // Next.js can reset scroll after hydration; retry so #book and other form
    // hashes still land on the contact form.
    let scrollTimer: number | undefined;
    if (hashIsFormTab) {
      scrollTimer = window.setTimeout(scrollToForm, 50);
    }

    const onHashChange = () => syncFromLocation(true);
    window.addEventListener("hashchange", onHashChange);
    window.addEventListener("popstate", onHashChange);
    return () => {
      if (scrollTimer) window.clearTimeout(scrollTimer);
      window.removeEventListener("hashchange", onHashChange);
      window.removeEventListener("popstate", onHashChange);
    };
  }, []);

  function selectTab(tab: FormTab) {
    setActiveTab(tab);
    window.history.replaceState(null, "", `#${tab}`);
    scrollToForm();
  }

  return (
    <div className="form-hub" id="form-hub">
      <div className="form-anchors" aria-hidden="true">
        {TABS.map((tab) => (
          <span key={tab.id} id={tab.id} />
        ))}
      </div>
      <div className="form-tabs" role="tablist" aria-label="Contact forms">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            className={`form-tab${activeTab === tab.id ? " active" : ""}`}
            onClick={() => selectTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="form-panel" role="tabpanel">
        {activeTab === "book" ? <SessionForm initialPackageId={initialPackageId} /> : null}
        {activeTab === "showcase-register" ? <ShowcaseForm /> : null}
        {activeTab === "creator-access" ? <CreatorForm /> : null}
        {activeTab === "academy-interest" ? <AcademyForm /> : null}
        {activeTab === "fundraiser-inquiry" ? <FundraiserForm /> : null}
      </div>

      <p className="form-fallback">
        Prefer email?{" "}
        <a href="mailto:info@nobackboard.com">info@nobackboard.com</a>
      </p>
    </div>
  );
}
