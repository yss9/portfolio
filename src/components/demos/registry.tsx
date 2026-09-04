import type { DemoScreen } from "@/content/types";
import { SayBridgeDemo } from "./saybridge";
import { GlopleDemo } from "./glople";
import { BlueMemoriesDemo } from "./bluememories";
import { NeoulteoDemo } from "./neoulteo";
import { MofyDemo } from "./mofy";

type DemoComponent = (props: { screens: DemoScreen[] }) => React.ReactNode;

/** slug → interactive mock demo. Projects without an entry simply render no
 *  demo section (AWS Deploy is infrastructure work with no UI to show). */
const registry: Record<string, DemoComponent> = {
  saybridge: SayBridgeDemo,
  glople: GlopleDemo,
  bluememories: BlueMemoriesDemo,
  neoulteo: NeoulteoDemo,
  mofy: MofyDemo,
};

export function ProjectDemo({
  slug,
  screens,
}: {
  slug: string;
  screens: DemoScreen[];
}) {
  const Demo = registry[slug];
  if (!Demo || screens.length === 0) return null;
  return <Demo screens={screens} />;
}

export function hasDemo(slug: string, screens: DemoScreen[]) {
  return Boolean(registry[slug]) && screens.length > 0;
}
