import { places } from '../data/site'
import { PageShell } from '../components/layout/PageShell'

export function WorldPage() {
  return (
    <PageShell route="/world">
      <section className="mx-auto max-w-[920px]" aria-labelledby="places-title">
        <h2 id="places-title" className="sr-only">Places</h2>
        <div className="grid grid-cols-1 gap-3 min-[768px]:grid-cols-6">
          {places.map((place, index) => (
            <article className={`min-h-[180px] border border-line bg-surface p-[22px] min-[768px]:min-h-[230px] ${['min-[768px]:col-span-4', 'min-[768px]:col-span-2', 'min-[768px]:col-span-2', 'min-[768px]:col-span-2', 'min-[768px]:col-span-4'][index]}`} key={place.name}>
              <p className="font-mono text-[10px] text-coral">0{index + 1}</p><h3 className="mt-[46px] mb-2 text-2xl tracking-[-.06em] min-[768px]:mt-[74px]">{place.name}</h3><p className="m-0 max-w-[28ch] leading-relaxed text-muted">{place.description}</p>
            </article>
          ))}
        </div>
      </section>
    </PageShell>
  )
}
