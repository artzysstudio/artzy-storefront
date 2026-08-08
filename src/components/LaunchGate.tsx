import type { ReactNode } from 'react';

export default function LaunchGate({ children }: { children: ReactNode }) {
  // Production gating is performed at Cloudflare's edge. Keeping hostname
  // checks out of React makes every statically exported preview route stable.
  return <>{children}</>;
}
