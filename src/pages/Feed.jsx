import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import PlayerPostCard from "../components/feed/PlayerPostCard";
import GameScoreCard from "../components/feed/GameScoreCard";
import EventCard from "../components/feed/EventCard";
import RegistrationCard from "../components/feed/RegistrationCard";
import ProductCard from "../components/feed/ProductCard";
import VideoCard from "../components/feed/VideoCard";

export default function Feed() {
  const [user, setUser] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => null);
  }, []);

  const { data: posts = [] } = useQuery({
    queryKey: ['posts'],
    queryFn: () => base44.entities.Post.list('-created_date'),
  });

  const { data: scheduleItems = [] } = useQuery({
    queryKey: ['schedule-feed'],
    queryFn: () => base44.entities.ScheduleItem.filter({ 
      status: 'completed',
      type: 'game'
    }, '-date', 10),
  });

  const { data: upcomingEvents = [] } = useQuery({
    queryKey: ['upcoming-events'],
    queryFn: async () => {
      const items = await base44.entities.ScheduleItem.list('-date');
      return items.filter(item => new Date(item.date) >= new Date()).slice(0, 5);
    },
  });

  const { data: programs = [] } = useQuery({
    queryKey: ['programs-feed'],
    queryFn: () => base44.entities.Program.filter({ 
      registration_open: true,
      status: 'active'
    }, '-created_date', 5),
  });

  const { data: products = [] } = useQuery({
    queryKey: ['products-feed'],
    queryFn: () => base44.entities.Product.filter({ 
      is_featured: true
    }, '-created_date', 5),
  });

  const { data: teams = [] } = useQuery({
    queryKey: ['teams-feed'],
    queryFn: () => base44.entities.Team.list(),
  });

  const { data: players = [] } = useQuery({
    queryKey: ['players-feed'],
    queryFn: () => base44.entities.Player.list(),
  });

  // Mix all content types together
  const getFeedItems = () => {
    const items = [];

    // Player posts
    posts.forEach(post => {
      items.push({ 
        type: post.type || 'player_post', 
        data: post, 
        timestamp: new Date(post.created_date),
        sortKey: new Date(post.created_date).getTime()
      });
    });

    // Game scores
    scheduleItems.forEach(game => {
      items.push({ 
        type: 'game_score', 
        data: game, 
        timestamp: new Date(game.date),
        sortKey: new Date(game.date).getTime()
      });
    });

    // Upcoming events
    upcomingEvents.forEach(event => {
      items.push({ 
        type: 'event_announcement', 
        data: event, 
        timestamp: new Date(event.date),
        sortKey: new Date(event.date).getTime() + 10000 // Boost upcoming
      });
    });

    // Registration CTAs
    programs.forEach(program => {
      items.push({ 
        type: 'registration_cta', 
        data: program, 
        timestamp: new Date(program.created_date),
        sortKey: new Date(program.created_date).getTime() + 5000
      });
    });

    // Featured products
    products.forEach(product => {
      items.push({ 
        type: 'product_feature', 
        data: product, 
        timestamp: new Date(product.created_date),
        sortKey: new Date(product.created_date).getTime()
      });
    });

    // Sort by sortKey (mixing chronological with some boosts)
    return items.sort((a, b) => b.sortKey - a.sortKey);
  };

  const feedItems = getFeedItems();

  const renderCard = (item) => {
    const team = teams.find(t => t.id === item.data.team_id);
    const player = players.find(p => p.id === item.data.player_id);

    switch (item.type) {
      case 'player_post':
        return <PlayerPostCard key={`post-${item.data.id}`} post={item.data} player={player} team={team} />;
      case 'game_score':
        return <GameScoreCard key={`game-${item.data.id}`} game={item.data} team={team} />;
      case 'event_announcement':
        return <EventCard key={`event-${item.data.id}`} event={item.data} team={team} />;
      case 'registration_cta':
        return <RegistrationCard key={`reg-${item.data.id}`} program={item.data} />;
      case 'product_feature':
        return <ProductCard key={`product-${item.data.id}`} product={item.data} />;
      case 'video':
        return <VideoCard key={`video-${item.data.id}`} post={item.data} player={player} team={team} />;
      default:
        return <PlayerPostCard key={`default-${item.data.id}`} post={item.data} player={player} team={team} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      {/* Header Gradient */}
      <div className="h-32 md:h-48 bg-gradient-to-br from-[#c9a962] via-purple-500 to-blue-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-[#0f0f0f]/40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white">Your Feed</h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto p-4 md:p-6 lg:p-8 -mt-8 pb-24">
        {/* Quick Filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
          {['all', 'posts', 'games', 'events', 'training'].map(f => (
            <Button
              key={f}
              variant={filter === f ? 'default' : 'outline'}
              onClick={() => setFilter(f)}
              className={`min-h-[44px] min-w-[44px] px-4 text-sm md:text-base flex-shrink-0 ${filter === f ? 'bg-[#c9a962] text-[#0A0A0A]' : 'border-white/[0.06] text-white'}`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Button>
          ))}
        </div>

        {/* Feed Items */}
        <div className="space-y-4">
          {feedItems.length === 0 ? (
            <div className="text-center py-12 md:py-20">
              <p className="text-white/40 mb-4 text-sm md:text-base">Your feed is empty. Start following players and teams!</p>
            </div>
          ) : (
            feedItems.map(item => renderCard(item))
          )}
        </div>
      </div>
    </div>
  );
}