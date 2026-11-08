# RetireMe design: the fan of futures

One screen answers one question: when can I stop working? Your numbers are on the left. On the right is the answer in words, a fan of possible futures that redraws as you drag, and a ranked list of what would change the answer most.

## Concept

Engineering graph paper, as if you were plotting your future by hand. The chart is the product: portfolio value by age, the spread of futures as a soft fan, and an "enough to stop working" line. The ages where the typical and the 9-in-10 futures cross that line are labeled on the chart itself.

## Tokens

| Token | Value | Use |
| --- | --- | --- |
| Paper | `#F4F7F2` | Background |
| Grid | `#DFE9DB` minor, `#C5D6C0` major | Graph paper, one line per year and per $200K |
| Ink | `#16302B` | Text, typical-future line, selected controls |
| Fan | `#2F6B5A` at 13% and 22% | 8 in 10 futures, half of futures |
| Enough | `#B7791F` | Enough to stop working, focus rings |
| Scenarios | `#2E5E9E` upskill, `#8A3B5C` move somewhere cheaper | Dashed comparison lines |

Type: Bricolage Grotesque (variable, self-hosted), tabular figures throughout.

## Behavior

- Every input updates the chart live. Simulation is deferred so sliders never stutter.
- Pointer or arrow keys over the chart read out any age in words below it.
- "Compare with" overlays a scenario's typical future and, when it differs, its own enough line.
- "What would change this most" ranks single changes by years gained. Apply changes your inputs; Show on chart turns on the matching scenario.
- Inputs persist in this browser (`localStorage`, wrapped in try/catch).
- Under 960 px the order is answer and chart, then inputs, then levers.

## Engine

`src/fan/engine.ts` is a stand-in that follows the contract so the UI could be built first. When the full engine lands in `src/engine/`, change the import in `src/fan/useSimulation.ts` and delete the stand-in.

### Notes for the engine port

1. **Lifestyle multiplier bug.** The original `0.7 + 0.9 * t` puts the slider midpoint at 1.15, so the default profile spends $72K and saves $12K on a $75K income. The UI now treats the slider as "spending once you stop, compared with today": 0 is 70%, 50 is the same, 100 is 160%. See `lifestyleMultiplier`.
2. **Contract additions** the UI uses: `SimResult.annualSpending` (spending once you stop, today's dollars), and `Assumptions.includeSocialSecurity`, `socialSecurityShareOfIncome`, `inflation`. Lever ids: `save500`, `spendLess`, `moveCheaper`, `upskill`, `moreGrowth`.
3. **Scenario thresholds.** `lowerCost` lowers spending, so its `threshold` differs from baseline. The chart draws it separately.
4. **Social Security cliff.** Many paths first reach enough at 67, when the threshold steps down, so several levers can show the same years gained. That's correct behavior, but it's worth smoothing if benefits are modeled by claiming age.
5. **Performance.** Sort each age column once, not once per percentile. That took the stand-in from about 150 ms to 20 ms per run.
