import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Drink = {
  id: string;
  name: string;
  recipe: string;
  price: string;
  rating: string;
};

export type SiteContent = {
  brand: string;
  navOrder: string;
  heroTitle: string;
  heroBody: string;
  heroCta: string;
  menuKicker: string;
  drinks: Drink[];
  aboutTitle: string;
  perks: { id: string; title: string; body: string }[];
  quizTitle: string;
  quizCta: string;
  footerNote: string;
};

export const defaultContent: SiteContent = {
  brand: "BODRIN",
  navOrder: "Order now",
  heroTitle: "Discover a superb taste in every single sip!",
  heroBody:
    "Coffee here isn't just a drink — it's a craft. Join us for a small culinary journey where every sip is a meeting with your perfect flavour.",
  heroCta: "Pick your coffee",
  menuKicker: "Today's top three",
  drinks: [
    {
      id: "cappuccino",
      name: "Cappuccino",
      recipe: "20% espresso, 40% steamed milk and 40% velvet foam.",
      price: "4.20",
      rating: "4.9",
    },
    {
      id: "latte",
      name: "Latte",
      recipe: "30% espresso and 70% freshly steamed milk, poured slow.",
      price: "4.80",
      rating: "5.0",
    },
    {
      id: "mocha",
      name: "Mocha",
      recipe: "20% espresso, 50% hot milk and 30% dark chocolate.",
      price: "5.10",
      rating: "4.7",
    },
  ],
  aboutTitle: "BODRIN is",
  perks: [
    {
      id: "p1",
      title: "Seriously good beans",
      body: "Our obsession starts at the farm. We taste every lot so each cup carries only the sweetest, cleanest notes.",
    },
    {
      id: "p2",
      title: "A room that feels warm",
      body: "Soft light, good music and slow chairs. Stay for one cup and end up staying for three.",
    },
    {
      id: "p3",
      title: "Built around your taste",
      body: "Tell us how you like it and we'll dial the shot in for you — sweeter, brighter, bolder, yours.",
    },
    {
      id: "p4",
      title: "Baristas who care",
      body: "Competition-trained hands, zero attitude. Ask them anything about the brew in front of you.",
    },
  ],
  quizTitle: "Find out which coffee suits you best",
  quizCta: "Take the taste test",
  footerNote: "Fresh roasts, new drinks and small news — every Friday.",
};

const STORAGE_KEY = "bodrin-content-v1";

type Ctx = {
  content: SiteContent;
  editing: boolean;
  setEditing: (v: boolean) => void;
  update: (path: string, value: string) => void;
  reset: () => void;
};

const ContentContext = createContext<Ctx | null>(null);

function setByPath(obj: SiteContent, path: string, value: string): SiteContent {
  const next = structuredClone(obj) as unknown as Record<string, unknown>;
  const keys = path.split(".");
  let cursor: Record<string, unknown> = next;
  for (let i = 0; i < keys.length - 1; i++) {
    cursor = cursor[keys[i]!] as Record<string, unknown>;
  }
  cursor[keys[keys.length - 1]!] = value;
  return next as unknown as SiteContent;
}

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent>(defaultContent);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setContent({ ...defaultContent, ...(JSON.parse(raw) as SiteContent) });
    } catch {
      /* ignore */
    }
  }, []);

  const persist = useCallback((next: SiteContent) => {
    setContent(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }, []);

  const update = useCallback(
    (path: string, value: string) => {
      setContent((prev) => {
        const next = setByPath(prev, path, value);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch {
          /* ignore */
        }
        return next;
      });
    },
    [],
  );

  const reset = useCallback(() => persist(defaultContent), [persist]);

  const value = useMemo(
    () => ({ content, editing, setEditing, update, reset }),
    [content, editing, update, reset],
  );

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error("useContent must be used inside ContentProvider");
  return ctx;
}