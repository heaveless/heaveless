import { PineTree, SnowDrift } from './Snow'

export const PAPER_START_ID = 'paper-start'

export function SnowLine() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 bottom-[calc(100%-1px)] h-[104px] min-[768px]:h-[146px]"
    >
      <SnowDrift className="absolute inset-x-0 bottom-0 h-full w-full text-paper" />
      <PineTree className="absolute bottom-[12%] left-[5%] h-9 w-6 text-pine-700 min-[768px]:left-[7%] min-[768px]:h-14 min-[768px]:w-9" />
      <PineTree className="absolute bottom-[8%] left-[10%] h-6 w-4 text-pine-600 min-[768px]:left-[12%] min-[768px]:h-8 min-[768px]:w-6" />
      <PineTree className="absolute bottom-[14%] left-[92%] hidden h-12 w-8 text-pine-700 min-[768px]:block" />
    </div>
  )
}
