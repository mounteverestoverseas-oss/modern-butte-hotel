import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import rooftopImg from "@/assets/rooftop-restaurant.jpg";
import { Button } from "@/components/ui/button";

type MenuItem = {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  is_available: boolean;
};

const CATEGORIES = ["starters", "mains", "desserts", "drinks"] as const;

export const RestaurantSection = () => {
  const [items, setItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    supabase
      .from("menu_items")
      .select("id,name,description,category,price,is_available")
      .eq("is_available", true)
      .order("category")
      .then(({ data }) => setItems((data as MenuItem[]) ?? []));
  }, []);

  return (
    <section id="restaurant" className="relative py-24 md:py-32 bg-background">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-20">
          <div className="relative">
            <img
              src={rooftopImg}
              alt="Newa Home rooftop restaurant overlooking the Himalayas at dusk"
              className="w-full h-[520px] object-cover rounded-sm shadow-2xl"
              loading="lazy"
            />
            <div className="absolute -bottom-6 -right-6 hidden md:block bg-primary text-primary-foreground px-6 py-4 font-serif">
              <div className="text-3xl leading-none">4th</div>
              <div className="text-[10px] uppercase tracking-widest mt-1">Floor Terrace</div>
            </div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-primary mb-4">
              The Rooftop
            </div>
            <h2 className="font-serif text-4xl md:text-5xl leading-tight mb-6">
              Dine above the valley
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-6">
              Our open-air rooftop restaurant pairs slow-fired Himalayan cuisine with sweeping
              views of the Kathmandu valley. Open from breakfast through a candlelit dinner
              service, with a curated cocktail list and seasonal tasting menu.
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground mb-8">
              <li>· Breakfast 7:00 – 10:30</li>
              <li>· Lunch 12:00 – 15:00</li>
              <li>· Dinner 18:30 – 22:30</li>
            </ul>
            <Button size="lg" asChild>
              <a href="#booking">Reserve a table</a>
            </Button>
          </div>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="text-xs uppercase tracking-[0.3em] text-primary mb-3">Seasonal Menu</div>
            <h3 className="font-serif text-3xl md:text-4xl">From the kitchen</h3>
          </div>

          {items.length === 0 ? (
            <p className="text-center text-muted-foreground">Menu coming soon.</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-x-12 gap-y-10">
              {CATEGORIES.map((cat) => {
                const list = items.filter((i) => i.category === cat);
                if (list.length === 0) return null;
                return (
                  <div key={cat}>
                    <h4 className="font-serif text-xl mb-5 capitalize border-b border-border pb-2">
                      {cat}
                    </h4>
                    <ul className="space-y-5">
                      {list.map((item) => (
                        <li key={item.id} className="flex justify-between gap-6">
                          <div>
                            <div className="font-medium">{item.name}</div>
                            {item.description && (
                              <div className="text-sm text-muted-foreground mt-1">
                                {item.description}
                              </div>
                            )}
                          </div>
                          <div className="font-serif text-primary whitespace-nowrap">
                            ${Number(item.price).toFixed(0)}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
