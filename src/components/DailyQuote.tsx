import { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';

const QUOTES = [
  { text: "Le succès n'est pas final, l'échec n'est pas fatal : c'est le courage de continuer qui compte.", author: "Churchill" },
  { text: "La seule façon de faire du bon travail est d'aimer ce que vous faites.", author: "Steve Jobs" },
  { text: "Chaque expert était autrefois un débutant.", author: "Helen Hayes" },
  { text: "Le génie est fait d'un pour cent d'inspiration et de quatre-vingt-dix-neuf pour cent de transpiration.", author: "Edison" },
  { text: "La motivation vous fait commencer. L'habitude vous fait continuer.", author: "Jim Ryun" },
  { text: "Il n'y a pas de raccourci vers un endroit qui en vaut la peine.", author: "Beverly Sills" },
  { text: "L'éducation est l'arme la plus puissante pour changer le monde.", author: "Mandela" },
  { text: "Celui qui déplace une montagne commence par déplacer de petites pierres.", author: "Confucius" },
  { text: "Le meilleur moment pour planter un arbre était il y a 20 ans. Le deuxième meilleur moment est maintenant.", author: "Proverbe" },
  { text: "Ce n'est pas la montagne que nous conquérons, mais nous-mêmes.", author: "Edmund Hillary" },
];

const DailyQuote = () => {
  const [quote, setQuote] = useState(QUOTES[0]);

  useEffect(() => {
    const day = new Date().getDate();
    setQuote(QUOTES[day % QUOTES.length]);
  }, []);

  return (
    <div className="fintech-card p-5 border border-foreground/5 relative overflow-hidden">
      <div className="absolute top-3 right-3 text-primary/20">
        <Sparkles size={40} />
      </div>
      <p className="text-sm leading-relaxed font-medium italic text-foreground/80 relative z-10">"{quote.text}"</p>
      <p className="text-xs text-primary font-bold mt-3 relative z-10">— {quote.author}</p>
    </div>
  );
};

export default DailyQuote;
