import type { Metadata } from 'next';
import ShopLayout from '@/components/layout/ShopLayout';

export const metadata: Metadata = {
  title: 'Ring Size Guide',
  description: 'Find your perfect ring size with the Aurelius Jewelry size guide — Indian, US, and UK ring size conversion chart.',
};

const RING_SIZES = [
  { indian: '5', us: '3', uk: 'F', diameter: '14.0', circumference: '44.0' },
  { indian: '6', us: '3.5', uk: 'G', diameter: '14.4', circumference: '45.2' },
  { indian: '7', us: '4', uk: 'H', diameter: '14.8', circumference: '46.5' },
  { indian: '8', us: '4.5', uk: 'I', diameter: '15.2', circumference: '47.8' },
  { indian: '9', us: '5', uk: 'J', diameter: '15.6', circumference: '49.0' },
  { indian: '10', us: '5.5', uk: 'K', diameter: '16.0', circumference: '50.3' },
  { indian: '11', us: '6', uk: 'L', diameter: '16.5', circumference: '51.5' },
  { indian: '12', us: '6.5', uk: 'M', diameter: '16.9', circumference: '52.8' },
  { indian: '13', us: '7', uk: 'N', diameter: '17.3', circumference: '54.0' },
  { indian: '14', us: '7.5', uk: 'O', diameter: '17.7', circumference: '55.3' },
  { indian: '15', us: '8', uk: 'P', diameter: '18.1', circumference: '56.6' },
  { indian: '16', us: '8.5', uk: 'Q', diameter: '18.5', circumference: '57.8' },
  { indian: '17', us: '9', uk: 'R', diameter: '18.9', circumference: '59.1' },
  { indian: '18', us: '9.5', uk: 'S', diameter: '19.4', circumference: '60.3' },
  { indian: '19', us: '10', uk: 'T', diameter: '19.8', circumference: '61.6' },
  { indian: '20', us: '10.5', uk: 'U', diameter: '20.2', circumference: '62.8' },
];

const STEPS = [
  { step: '1', title: 'Cut a strip of paper', desc: 'Cut a thin strip of paper or use a piece of string about 10 cm long.' },
  { step: '2', title: 'Wrap around your finger', desc: 'Wrap it snugly around the base of the finger you want to measure.' },
  { step: '3', title: 'Mark the overlap', desc: 'Mark the point where the paper overlaps with a pen.' },
  { step: '4', title: 'Measure the length', desc: 'Lay the paper flat and measure the length in mm. This is your circumference.' },
  { step: '5', title: 'Find your size', desc: 'Match your circumference to the chart below to find your Indian ring size.' },
];

export default function SizeGuidePage() {
  return (
    <ShopLayout>
      <section className="bg-ivory py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="font-sans text-2xs tracking-[0.35em] uppercase text-gold-500 mb-4">Perfect Fit</p>
          <h1 className="font-serif text-4xl sm:text-5xl font-light text-charcoal">Ring Size Guide</h1>
          <div className="gold-divider mt-6" />
        </div>
      </section>

      {/* How to measure */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="font-serif text-2xl font-light text-charcoal text-center mb-10">How to Measure Your Ring Size</h2>
        <div className="grid sm:grid-cols-5 gap-6">
          {STEPS.map(({ step, title, desc }) => (
            <div key={step} className="text-center">
              <span className="font-serif text-2xl font-light text-gold-500 block mb-2">{step}</span>
              <h3 className="font-sans text-xs font-medium tracking-wide uppercase text-charcoal mb-1">{title}</h3>
              <p className="font-sans text-xs text-charcoal-muted leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Chart */}
      <section className="bg-ivory">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="font-serif text-2xl font-light text-charcoal text-center mb-8">Size Conversion Chart</h2>
          <div className="border border-gray-200 overflow-x-auto bg-white">
            <table className="w-full font-sans text-sm min-w-[500px]">
              <thead>
                <tr className="bg-charcoal text-white">
                  <th className="px-4 py-3 text-left text-2xs tracking-[0.15em] uppercase font-medium">Indian</th>
                  <th className="px-4 py-3 text-left text-2xs tracking-[0.15em] uppercase font-medium">US</th>
                  <th className="px-4 py-3 text-left text-2xs tracking-[0.15em] uppercase font-medium">UK</th>
                  <th className="px-4 py-3 text-left text-2xs tracking-[0.15em] uppercase font-medium">Diameter (mm)</th>
                  <th className="px-4 py-3 text-left text-2xs tracking-[0.15em] uppercase font-medium">Circumference (mm)</th>
                </tr>
              </thead>
              <tbody className="text-charcoal-muted">
                {RING_SIZES.map((s, i) => (
                  <tr key={s.indian} className={i % 2 === 0 ? 'bg-white' : 'bg-ivory/50'}>
                    <td className="px-4 py-2.5 font-medium text-charcoal">{s.indian}</td>
                    <td className="px-4 py-2.5">{s.us}</td>
                    <td className="px-4 py-2.5">{s.uk}</td>
                    <td className="px-4 py-2.5">{s.diameter}</td>
                    <td className="px-4 py-2.5">{s.circumference}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8 border border-gold-200 bg-gold-50/30 p-5 text-center">
            <p className="font-sans text-xs text-charcoal-muted">
              <strong className="text-charcoal">Pro tip:</strong> Measure at the end of the day when fingers are slightly
              larger. If between sizes, choose the larger size for comfort.
            </p>
          </div>
        </div>
      </section>
    </ShopLayout>
  );
}
