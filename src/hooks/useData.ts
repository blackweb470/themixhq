import useSWR from 'swr';
import useSWRInfinite from 'swr/infinite';
import { supabase } from '../lib/supabase';
import type { Article } from '../types';

const PAGE_SIZE = 15;

const mapArticle = (row: any): Article => ({
    id: row.id,
    title: row.title,
    excerpt: row.excerpt,
    category: row.category || 'news',
    categoryLabel: row.category_label || 'News',
    image: row.cover_image_url || '/images/music-culture.jpg',
    author: 'theMixhq',
    date: row.published_at ? new Date(row.published_at).toISOString().split('T')[0] : '',
    readTime: `${Math.ceil((row.word_count || 300) / 200)} min read`,
    featured: row.is_featured,
    trending: row.is_trending,
    breaking: row.is_breaking,
    content: row.content,
    status: row.status,
    subheading: row.subheading,
    cover_image_url: row.cover_image_url,
    seo_title: row.seo_title,
    seo_description: row.seo_description,
    likes: row.likes || 0,
    dislikes: row.dislikes || 0
});

// Fetcher for Articles
const fetchArticles = async ([_key, includeDrafts]: [string, boolean]) => {
  let query = supabase
    .from('articles')
    .select('*')
    .order('published_at', { ascending: false });

  if (!includeDrafts) {
    query = query.eq('status', 'published');
  }

  const { data, error } = await query;

  if (error) throw new Error(error.message);
  
  // Map Supabase rows to the local Article type shape so we don't break existing components
  return data.map(mapArticle);
};

export function useArticles(includeDrafts: boolean = false) {
  const { data, error, isLoading, mutate } = useSWR(['articles', includeDrafts], fetchArticles, {
    revalidateOnFocus: true,
    revalidateIfStale: true,
    dedupingInterval: 2000, // Only deduplicate within 2 seconds
    keepPreviousData: true,
  });

  return {
    articles: data || [],
    isLoading,
    isError: error,
    mutate
  };
}

// Infinite fetcher for Published Articles
const fetchPublishedArticlesPage = async ([_, __, cat, pageIndex]: [string, string, string, number]) => {
  const from = pageIndex * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  let query = supabase
    .from('articles')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .range(from, to);

  if (cat !== 'all') {
    query = query.eq('category', cat);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  
  return data.map(mapArticle);
};

export function usePublishedArticlesInfinite(category?: string) {
  const getKey = (pageIndex: number, previousPageData: Article[]) => {
    if (previousPageData && !previousPageData.length) return null; // reached the end
    return ['articles', 'published', category || 'all', pageIndex] as [string, string, string, number];
  };

  const { data, error, size, setSize, isValidating, mutate } = useSWRInfinite(
    getKey,
    fetchPublishedArticlesPage,
    {
      revalidateFirstPage: false,
      revalidateOnFocus: false,
      revalidateAll: false,
    }
  );

  const articles = data ? data.flat() : [];
  const isLoadingInitialData = !data && !error;
  const isLoadingMore = isLoadingInitialData || (size > 0 && data && typeof data[size - 1] === "undefined");
  const isEmpty = data?.[0]?.length === 0;
  const isReachingEnd = isEmpty || (data && data[data.length - 1]?.length < PAGE_SIZE);

  return {
    articles,
    isLoading: isValidating || isLoadingMore || isLoadingInitialData,
    isError: error,
    size,
    setSize,
    isReachingEnd,
    mutate
  };
}

// Fetcher for Instagram
const fetchInstagram = async () => {
  const { data, error } = await supabase
    .from('instagram_posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  
  return data.map(row => ({
    id: row.id,
    image: row.image_url,
    likes: row.likes,
    caption: row.caption
  }));
};

export function useInstagram() {
  const { data, error, isLoading } = useSWR('instagram', fetchInstagram, {
    revalidateOnFocus: false,
    revalidateIfStale: false,
    revalidateOnReconnect: false,
    dedupingInterval: 1000 * 60 * 60, // Cache Instagram posts for 1 full hour
    keepPreviousData: true,
  });

  return {
    posts: data || [],
    isLoading,
    isError: error
  };
}

export function useComments(articleId: string | undefined | null) {
  const fetchComments = async (id: string) => {
    if (!id) return [];
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('article_id', id)
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data;
  };

  const { data, error, isLoading, mutate } = useSWR(
    articleId ? ['comments', articleId] : null,
    ([_, id]) => fetchComments(id as string),
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000, 
    }
  );

  return {
    comments: data || [],
    isLoading,
    isError: error,
    mutate
  };
}

export function usePromotions() {
  const fetchPromos = async () => {
    const { data, error } = await supabase.from('promotions').select('*').order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return data;
  };
  const { data, isLoading, mutate } = useSWR('promotions', fetchPromos);
  return { promotions: data || [], isLoading, mutate };
}

export function useStaff() {
  const fetchStaff = async () => {
    const { data, error } = await supabase.from('staff').select('*').order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return data;
  };
  const { data, isLoading, mutate } = useSWR('staff', fetchStaff);
  return { staff: data || [], isLoading, mutate };
}

export function useSettings() {
  const fetchSettings = async () => {
    const { data, error } = await supabase.from('settings').select('*').limit(1).single();
    if (error && error.code !== 'PGRST116') throw new Error(error.message);
    return data;
  };
  const { data, isLoading, mutate } = useSWR('settings', fetchSettings);
  return { settings: data || null, isLoading, mutate };
}

export function useActiveAd(zone: string, slotIndex: number = 0) {
  const fetchAd = async () => {
    // Fetch ads that are active
    const { data, error } = await supabase
      .from('promotions')
      .select('*')
      .eq('status', 'active')
      .eq('zone', zone);

    if (error) throw new Error(error.message);
    
    // Filter ads by date in JavaScript to handle nulls and cross-browser date parsing safely
    const validAds = (data || []).filter(ad => {
      // safely replace space with T for Safari compatibility if needed
      const safeStart = ad.start_date ? ad.start_date.replace(' ', 'T') : null;
      const safeEnd = ad.end_date ? ad.end_date.replace(' ', 'T') : null;
      
      const start = safeStart ? new Date(safeStart).getTime() : 0;
      const end = safeEnd ? new Date(safeEnd).getTime() : Infinity;
      const current = Date.now();
      return current >= start && current <= end;
    });

    if (validAds.length === 0) return null;

    // ALGORITHM: Deterministic Rotation based on Slot Index
    // Instead of random (which could cause two slots to show the exact same ad), 
    // we use the slotIndex to pick distinct ads if multiple exist in the same zone.
    const selectedAd = validAds[slotIndex % validAds.length];
    
    // Asynchronously log an impression
    supabase.rpc('increment_impression', { row_id: selectedAd.id }).then(({ error }) => {
       // Fallback if RPC doesn't exist
       if (error) {
         supabase.from('promotions').update({ impressions: selectedAd.impressions + 1 }).eq('id', selectedAd.id).then();
       }
    });

    return selectedAd;
  };

  const { data, isLoading } = useSWR(['activeAd', zone, slotIndex], fetchAd, {
    revalidateOnFocus: false,
    dedupingInterval: 60000 // Don't cycle the ad for at least 1 minute per session for the same zone+slot
  });

  return { ad: data, isLoading };
}

export function useSubscribers() {
  const fetchSubscribers = async () => {
    const { data, error } = await supabase.from('subscribers').select('*').order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return data;
  };
  const { data, isLoading, mutate } = useSWR('subscribers', fetchSubscribers);
  return { subscribers: data || [], isLoading, mutate };
}
