"use client";

/**
 * store Instagram post URLs (manually) and embed them.
 *
 * - We render <blockquote class="instagram-media">...</blockquote>
 * - We load Instagram's embed script once on the page.
 * - When the URLs change, we ask IG to "process" embeds again.
 */

import { useEffect } from "react";

type Props = {
  instagramUsername?: string | null;
  instagramPostUrls?: string[] | null;
};

declare global {
  interface Window {
    instgrm?: any;
  }
}

/**
 * Loads Instagram's embed script (only once).
 * Then we call instgrm.Embeds.process() to render the embeds.
 */
function useInstagramEmbeds(deps: any[]) {
  useEffect(() => {
    const SCRIPT_ID = "instagram-embed-script";

    const processEmbeds = () => {
      // Instagram injects `window.instgrm`
      if (window.instgrm?.Embeds?.process) {
        window.instgrm.Embeds.process();
      }
    };

    // If script already exists, just process
    if (document.getElementById(SCRIPT_ID)) {
      processEmbeds();
      return;
    }

    // Otherwise, add the script
    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.async = true;
    script.defer = true;
    script.src = "https://www.instagram.com/embed.js";

    script.onload = () => processEmbeds();

    document.body.appendChild(script);
  }, deps);
}

export default function InstagramPreview({
  instagramUsername,
  instagramPostUrls,
}: Props) {
  const username = instagramUsername?.trim();
  const posts = (instagramPostUrls ?? []).filter(Boolean);

  // Re-run embed processing whenever the post list changes
  useInstagramEmbeds([posts.join("|")]);

  const profileUrl = username
    ? `https://www.instagram.com/${username}/`
    : null;

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold">Instagram</h3>
          {username ? (
            <p className="text-sm text-white/70">@{username}</p>
          ) : (
            <p className="text-sm text-white/60">No Instagram linked yet.</p>
          )}
        </div>

        {profileUrl && (
          <a
            href={profileUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm font-medium hover:bg-white/15"
          >
            View profile →
          </a>
        )}
      </div>

      {/* Gallery */}
      {posts.length > 0 ? (
        <div className="mt-4 grid grid-cols-1 gap-4">
          {posts.slice(0, 6).map((url) => (
            <div key={url} className="overflow-hidden rounded-2xl">
              {/* Instagram embed expects this markup */}
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
              />
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-4 text-sm text-white/60">
          Add a few Instagram post links to show a gallery here.
        </p>
      )}
    </div>
  );
}
