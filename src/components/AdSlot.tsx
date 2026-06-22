import { useActiveAd } from '@/hooks/useData';

export function AdSlot({ zone, slotIndex = 0 }: { zone: string, slotIndex?: number }) {
  const { ad, isLoading } = useActiveAd(zone, slotIndex);

  if (isLoading || !ad) {
    return null; // Don't show a placeholder, to prevent flashing and disappearing
  }

  let sizeClasses = "max-w-[728px] h-[90px]"; // Header Banner default
  let textClasses = "text-2xl";
  
  if (zone === "Sidebar Widget") {
    sizeClasses = "max-w-[300px] h-[250px] mx-auto"; // Medium rectangle
    textClasses = "text-xl text-center px-4 leading-tight";
  } else if (zone === "In-Article Feed") {
    sizeClasses = "w-full h-[250px] sm:h-[300px]"; // Large responsive banner
    textClasses = "text-3xl sm:text-4xl text-center px-8 leading-tight";
  }

  return (
    <div className={`w-full bg-gray-50 flex justify-center ${zone === 'Sidebar Widget' ? 'bg-transparent' : 'py-6 border-y border-gray-200 my-8'}`}>
      <a 
        href={ad.link_url || '#'} 
        target="_blank" 
        rel="noopener noreferrer"
        className={`w-full ${sizeClasses} bg-red-600 flex items-center justify-center text-white font-black uppercase tracking-widest relative overflow-hidden group hover:opacity-95 transition-all duration-300 rounded-lg shadow-md hover:shadow-xl`}
      >
        {ad.image_url ? (
          <img src={ad.image_url} alt={ad.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-red-600 via-purple-700 to-black opacity-80 group-hover:opacity-90 transition-opacity duration-500"></div>
            <div className="relative z-10 flex flex-col items-center justify-center p-6 h-full">
              <span className={`${textClasses} drop-shadow-xl`}>{ad.title}</span>
              {ad.link_url && (
                <span className="mt-6 text-[10px] sm:text-xs font-sans uppercase tracking-widest bg-white text-black px-6 py-3 rounded-full hover:bg-gray-100 transition-colors shadow-2xl flex items-center gap-2">
                  Learn More →
                </span>
              )}
            </div>
          </>
        )}
        <span className="absolute top-2 right-2 text-[9px] tracking-widest uppercase opacity-80 z-10 bg-black/70 px-2 py-1 rounded text-white font-sans backdrop-blur-sm">Ad</span>
      </a>
    </div>
  );
}
