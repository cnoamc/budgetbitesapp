import * as React from "react";

/**
 * This app is iPhone-only, so useIsMobile always returns true.
 * This prevents any tablet/desktop layouts from being rendered.
 */
export function useIsMobile() {
  // Always return true - this is an iPhone-only app
  return true;
}
