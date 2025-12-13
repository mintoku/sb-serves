"use client";

import { useEffect } from "react";

type Props = {
  instagramUsername?: string;
  instagramPostUrls?: string[];
};

declare global {
  interface Window {
    instgrm?: any;
  }
}

export default function InstagramPreview({
  instagramUsername,
  instagramPostUrls,
}: Props) {
  const posts = Array.isArray(instagramPostUrls) ? instagramPostUrls : [];

  useEffect(() => {
    const SCRIPT_ID = "instagram-embed-script";

    const process = () => {
      // Call twice (timing can be finicky)
      if (window.instgrm?.Embeds?.process) {
        window.instgrm.Embeds.process();
        setTimeout(() => window.instgrm?.Embeds?.process?.(), 100);
      }
    };

    // If already loaded, just process
    if (document.getElementById(SCRIPT_ID)) {
      process();
      return;
    }

    // Inject script once
    const s = document.createElement("script");
    s.id = SCRIPT_ID;
    s.async = true;
    s.defer = true;
    s.src = "https://www.instagram.com/embed.js";
    s.onload = process;

    document.body.appendChild(s);
  }, [posts.join("|")]);

  const profileUrl = instagramUsername
    ? `https://www.instagram.com/${instagramUsername.replace("@", "")}/`
    : undefined;

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold">Instagram</h3>
        {profileUrl && (
          <a
            href={profileUrl}
            target="_blank"
            rel="noreferrer"
            className="text-sm font-medium text-emerald-600 hover:underline"
          >
            View profile →
          </a>
        )}
      </div>

      {posts.length === 0 ? (
        <p className="mt-3 text-sm text-neutral-500">
          No posts linked yet.
        </p>
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-4">
          {posts.slice(0, 6).map((url) => (
            <div key={url} className="overflow-hidden rounded-2xl">
              <blockquote
                className="instagram-media"
                data-instgrm-permalink={url}
                data-instgrm-version="14"
                style={{
                  background: "transparent",
                  border: 0,
                  margin: 0,
                  padding: 0,
                  width: "100%",
                }}
              >
                <a href={url} target="_blank" rel="noreferrer">
                  View this post on Instagram
                </a>
              </blockquote>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
