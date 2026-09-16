const u = (id, w = 800) =>
  `https://images.unsplash.com/photo-${id}?q=80&w=${w}&auto=format&fit=crop`;

const p = (id) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1400`;

export const brands = [
  {
    slug: 'dior',
    name: 'Dior',
    founded: 1946,
    country: 'France',
    heroImage: u('1541643600914-78b084683601', 1600),
    logoColor: '#111111',
    description:
      'Founded by Christian Dior in 1946, the House of Dior has defined French luxury with couture, beauty and fragrance. From Sauvage to J\u2019adore, each composition is an emblem of audacious elegance.',
    tagline: 'Maison of audacious elegance.',
    featured: true,
  },
  {
    slug: 'chanel',
    name: 'Chanel',
    founded: 1910,
    country: 'France',
    heroImage: u('1588405748880-12d1d2a59f75', 1600),
    logoColor: '#111111',
    description:
      'Coco Chanel revolutionised modern femininity, and her legacy lives on through paradoxical classics like N\u00b05 and Bleu de Chanel \u2014 fragrances of timeless, effortless sophistication.',
    tagline: 'Timeless elegance, redefined.',
    featured: true,
  },
  {
    slug: 'yves-saint-laurent',
    name: 'Yves Saint Laurent',
    founded: 1961,
    country: 'France',
    heroImage: u('1592945403244-b3fbafd7f539', 1600),
    logoColor: '#111111',
    description:
      'Yves Saint Laurent turned fashion into a lifestyle of attitude. Bold scents like Black Opium and Y capture the rebellious, liberated spirit of the maison.',
    tagline: 'Audacity as a signature.',
    featured: true,
  },
  {
    slug: 'giorgio-armani',
    name: 'Giorgio Armani',
    founded: 1975,
    country: 'Italy',
    heroImage: u('1523293182086-7651a899d37f', 1600),
    logoColor: '#111111',
    description:
      'The understated luxury of Armani translates into fragrance as a masterclass in clean, sophisticated composition \u2014 from the aquatic icon Acqua di Gi\u00f2 to the radiant S\u00ec.',
    tagline: 'Quietly iconic.',
    featured: true,
  },
  {
    slug: 'tom-ford',
    name: 'Tom Ford',
    founded: 2005,
    country: 'USA',
    heroImage: p('965989'),
    logoColor: '#111111',
    description:
      'Tom Ford Private Blend is luxury pushed to the edge. Rare ingredients, provocative composition and unmistakable presence define a collection that truly smells like money.',
    tagline: 'Luxury with an edge.',
    featured: true,
  },
  {
    slug: 'gucci',
    name: 'Gucci',
    founded: 1921,
    country: 'Italy',
    heroImage: u('1610461888750-10bfc601b874', 1600),
    logoColor: '#111111',
    description:
      'Gucci fuses Italian opulence with a modern, genderless sensitivity. Fragrances like Guilty and Bloom are bold statements of self-expression for a new generation.',
    tagline: 'Modern opulence.',
    featured: true,
  },
  {
    slug: 'versace',
    name: 'Versace',
    founded: 1978,
    country: 'Italy',
    heroImage: u('1534582796250-1a5d3feb1ec8', 1600),
    logoColor: '#111111',
    description:
      'Gianni Versace\u2019s Medusa still rules. Bold, provocative and glamorous, the house\u2019s fragrances \u2014 from Eros to Bright Crystal \u2014 are pure Italics attitude in a bottle.',
    tagline: 'Bold Mediterranean glamour.',
    featured: true,
  },
  {
    slug: 'prada',
    name: 'Prada',
    founded: 1913,
    country: 'Italy',
    heroImage: u('1547887538-e3a2f32cb1cc', 1600),
    logoColor: '#111111',
    description:
      'Prada is minimalism with a hidden heart. Its olfactory collection is cerebral and precise, balancing razor-sharp freshness with warm, unexpected depth.',
    tagline: 'Intellectual minimalism.',
    featured: false,
  },
  {
    slug: 'jean-paul-gaultier',
    name: 'Jean Paul Gaultier',
    founded: 1976,
    country: 'France',
    heroImage: p('1445696'),
    logoColor: '#111111',
    description:
      'Enfant terrible of fashion, JPG wrapped fragrances in sailor bodies and scandal. Le Male and Scandal remain the most instantly recognisable bottles on the shelf.',
    tagline: 'Ruining couture, beautifully.',
    featured: false,
  },
  {
    slug: 'rabanne',
    name: 'Rabanne',
    founded: 1966,
    country: 'France',
    heroImage: p('9689110'),
    logoColor: '#111111',
    description:
      'Paco Rabanne\u2019s metal-chic built the boldest crowd pleasers in modern fragrance \u2014 all-gold 1 Million, athletic Invictus and the futuristic Phantom.',
    tagline: 'Bold, metallic, fearless.',
    featured: false,
  },
  {
    slug: 'valentino',
    name: 'Valentino',
    founded: 1960,
    country: 'Italy',
    heroImage: u('1645687032660-9f0acec3b1a0', 1600),
    logoColor: '#111111',
    description:
      'Roman haute couture translated to scent. Born in Roma captures the eternal city\u2019s energy in modern, sculpted bottles made for confident self-expression.',
    tagline: 'Born in Roma.',
    featured: true,
  },
  {
    slug: 'carolina-herrera',
    name: 'Carolina Herrera',
    founded: 1980,
    country: 'Venezuela / USA',
    heroImage: p('7771622'),
    logoColor: '#111111',
    description:
      'Red-carpet glamour bottled in heels and bolts of lightning. Good Girl and Bad Boy are as unforgettable as the designer\u2019s couture.',
    tagline: 'Glamour with a wink.',
    featured: false,
  },
  {
    slug: 'dolce-gabbana',
    name: 'Dolce & Gabbana',
    founded: 1985,
    country: 'Italy',
    heroImage: p('1301809'),
    logoColor: '#111111',
    description:
      'Two Sicilian designers poured the Mediterranean sun into Light Blue and The One \u2014 fragrances of brine, citrus, flowers and a deep sense of belonging.',
    tagline: 'Sicilian sunshine in a bottle.',
    featured: false,
  },
  {
    slug: 'burberry',
    name: 'Burberry',
    founded: 1856,
    country: 'United Kingdom',
    heroImage: p('5905366'),
    logoColor: '#111111',
    description:
      'From the trenches to the runway, Burberry embodies British weatherproof luxury. Hero and Her are modern icons built on heritage and attitude.',
    tagline: 'British luxury, rain or shine.',
    featured: false,
  },
  {
    slug: 'givenchy',
    name: 'Givenchy',
    founded: 1952,
    country: 'France',
    heroImage: u('1607342965472-6bb6fa929d2d', 1600),
    logoColor: '#111111',
    description:
      'The maison that dressed Audrey Hepburn crafts refined, couture-level compositions \u2014 from the enduring Gentleman to the forbidden L\u2019Interdit.',
    tagline: 'Parisian haute couture scent.',
    featured: false,
  },
  {
    slug: 'hermes',
    name: 'Herm\u00e8s',
    founded: 1837,
    country: 'France',
    heroImage: u('1563170351-be82bc888aa4', 1600),
    logoColor: '#111111',
    description:
      'The benchmark of French craftsmanship. Herm\u00e8s perfumers create quiet, exceptional scents like Terre d\u2019Herm\u00e8s where nature and savoir-faire meet.',
    tagline: 'Crafting the extraordinary.',
    featured: false,
  },
  {
    slug: 'montblanc',
    name: 'Montblanc',
    founded: 1906,
    country: 'Germany',
    heroImage: u('1592914610354-fd354ea45e48', 1600),
    logoColor: '#111111',
    description:
      'Writer\u2019s instruments to lifestyle icons, Montblanc crafts dependable, polished fragrances that embody the explorer\u2019s spirit \u2014 accessible luxury at its best.',
    tagline: 'The spirit of discovery.',
    featured: false,
  },
  {
    slug: 'maison-margiela',
    name: 'Maison Margiela',
    founded: 1988,
    country: 'Belgium / France',
    heroImage: p('8522301'),
    logoColor: '#111111',
    description:
      'Anonymity meets artistry. Margiela\u2019s Replica collection freezes memories \u2014 By the Fireplace, Jazz Club \u2014 into wearable, story-telling scents.',
    tagline: 'Memories, replicated.',
    featured: false,
  },
  {
    slug: 'jo-malone-london',
    name: 'Jo Malone London',
    founded: 1994,
    country: 'United Kingdom',
    heroImage: u('1615160454881-401a00dc3c31', 1600),
    logoColor: '#111111',
    description:
      'The master of layering. Jo Malone London builds clean, cologne-based scents that invite you to mix and wear as your own \u2014 light, bright and endlessly personal.',
    tagline: 'Sensuous simplicity.',
    featured: false,
  },
  {
    slug: 'creed',
    name: 'Creed',
    founded: 1760,
    country: 'France',
    heroImage: p('3181712'),
    logoColor: '#111111',
    description:
      'For over 260 years and seven generations, Creed has hand-crafted perfumes for royalty. Aventus, Green Irish Tweed and friends remain the pinnacle of olfactory luxury.',
    tagline: 'A fragrance for royalty.',
    featured: true,
  },
];

export const getBrandBySlug = (slug) =>
  brands.find((b) => b.slug === slug);

export const getBrandSlug = (name) => {
  const found = brands.find(
    (b) => b.name.toLowerCase() === String(name).toLowerCase()
  );
  return found ? found.slug : String(name).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
};

export const featuredBrands = brands.filter((b) => b.featured);