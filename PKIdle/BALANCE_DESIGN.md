# Economy and upgrade design — first pass

The original eleven buildings, their prices, their output, their three upgrades, and the CA ceremonies are retained. This pass adds progression around them. Numbers below are starting tuning values; formula tests cannot substitute for a full playthrough.

## Why buildings stopped being useful

A building's purchase price grows by 20% per unit, but its original upgrade ladder ended at 25 owned. Later buildings outpaced earlier ones and manual clicking stayed at one certificate. More doublings alone cannot overcome that exponential price curve indefinitely. Building links give old purchases a contribution to newer production, and the purchase card now reports the whole gain and its payback time so the tradeoff is visible.

## Implemented future infrastructure

These follow K8S Cert Manager in the shop and are explicitly marked fictional.

| Building | Base price | Base cert/sec | Upgrade names |
| --- | ---: | ---: | --- |
| AI Cert Gen | 14 trillion | 70 million | Prompt Engineering Department; Please Stop Inventing OIDs; Attention Is All You Sign |
| Sentient CA | 180 trillion | 400 million | I Sign, Therefore I Am; Existential Key Rotation; The CA Demands Dental |
| Orbital Trust Array | 2.5 quadrillion | 2.5 billion | Low Earth Enrollment; Zero-Gravity Key Ceremony; Houston, We Have a Wildcard |
| Multiverse Notary | 35 quadrillion | 16 billion | Parallel Signing; Schrödinger's Revocation; Everything Everywhere All at ASN.1 |

The new buildings use the original 1/5/25-unit doubling pattern and cost ratios. Their first purchase pays back in roughly 200,000–2,187,500 seconds at unmodified base output; late upgrades and links shorten that. This follows the existing late-game pacing rather than making future buildings immediately obsolete the current fleet. The initial K8S purchase is already a 100,000-second base payback: late-game progression still needs playtesting.

## Implemented upgrades

- **Ownership milestones:** another doubling at 50, 100, 150 and 200 of every building. Prices are 500 / 5,000 / 50,000 / 500,000 times base cost. The ownership threshold is the main gate. These are optional long-term goals, not a claim that buying 200 units is always efficient.
- **Adjacent building links:** unlock with 15 of the earlier building and 5 of the next one, at 10 times the later building's base price. Each earlier unit boosts the next building by 1%; each later unit boosts the earlier building by 5%. Links add to the same building's synergy factor rather than multiplying each other.
- **A Finger in Every Protocol:** 25 Clickers + 5 Online CAs; costs 50,000. Every non-clicker adds 0.5 cert/sec to each Clicker before its multipliers.
- **Distributed Approval Network:** 50 Clickers + 5 CMPv2; costs 25 million. Each Clicker adds 0.2% output to every other building, including future ones.
- **Peer Review at Scale:** 50 Operators + 10 CMPv2; costs 250 million. Each Operator adds 0.2% output to every other building. This offers an operator-focused progression path without starting the rebellion.
- **Copy / Paste CSR → Approve All Pending → Jellyfish Gesture Signing:** costs 2,500 / 250,000 / 25 million, requires 100 / 500 / 2,500 manual clicks, and unlocks sequentially. Clicks gain 1% / 3% / 6% of spendable passive CPS in total, plus the original base click. At four clicks per second, the full chain adds about 24% of passive production. Idle Clickers remain passive buildings and do not count as manual clicks.

Building cards report the difference in spendable CPS before/after buying a unit, including effects on linked buildings, the active cryptographic penalty, and rogue diversion. Payback assumes the current conditions persist and excludes manual clicks, milestone purchases and eventual audit rewards.

## Implemented Operatocalypse

Existing Payrise, Overtime and Forced Work keep their effects. Forced Work alone does **not** start the event. Purchasing the clearly labelled Algorithmic Management upgrade opts into it; each later stage requires the previous research upgrade.

| Research | Unlock | Cost | Operator output | Extra fleet boost | Passive diversion | Audit recovery |
| --- | --- | ---: | --- | ---: | ---: | ---: |
| Algorithmic Management | Forced Work, 25 Operators, 5 Online CAs | 1 million | ×2 | +10% | 3% | 110% |
| Sleep Is a Legacy Protocol | Previous stage, 50 Operators, 10 REST APIs | 100 million | Another ×2 | +25% | 6% | 120% |
| Root Access for Everyone | Previous stage, 100 Operators, 5 ACMEs | 10 billion | Another ×2 | +50% | 10% | 130% |

Fleet boosts replace the previous stage's boost. Each research doubling stacks with the original operator upgrades. The fixed ceremony bonus remains fixed, although it still experiences the existing cryptographic penalty and passive diversion.

Operators divert passive production into persistent rogue issuance queues. The displayed CPS is what enters your spendable balance. Auditing empties the queues and returns the stored amount with the current stage's bonus. Manual clicks are not diverted and their percentage bonus uses spendable CPS to avoid counting the rogue stream twice.

- **Audit queues:** immediate recovery, no cost. Only the actual stored backlog is paid out, so repeated audits cannot duplicate certificates.
- **Pizza truce:** spend 30 seconds of current gross production to pause fleet overdrive and diversion for 60 seconds. It retains all operator doublings. It is a flavour/containment option rather than an economically optimal purchase in this version.
- **Safety charter:** free, reversible, indefinite suspension of fleet overdrive and diversion. Keeps operator upgrades and the audit backlog. Resuming overdrive restores the purchased stage when any truce ends.

This first version treats the security concern as a diverted queue, not destroyed inventory or surprise bank wipes. It creates a choice between reliable spendable production and a boosted stream that needs audits. A truce/charter deliberately gives up the extra fleet boost. The state is saved locally and existing saves gain zero future buildings and an inactive rebellion by default.

## Recommended next iteration — suggestions, not implemented

1. **Incident / opportunity events:** a rare Rogue Root Surge boosts passive production briefly; an Emergency Revocation reduces production temporarily. A normal Golden Certificate counterpart could grant Audit Clean Bill or Signing Frenzy. Keep effects readable and capped before considering stacked click combos.
2. **Individual rogue CAs around the jellyfish:** turn the aggregate backlog into up to three clickable rogue intermediates, each with its own queue. Let them spawn over time rather than adding surprise permanent losses. This would give the rebellion a stronger visual identity.
3. **Timed research:** an Operator Research Committee unlocks the three current rebellion upgrades after short research intervals. Waiting should reveal a specific upcoming benefit, not merely lock the shop.
4. **Ethical operator branch:** Union-Approved Automation, Four-Day Key Week, and Two-Person Control. Give reliable output or faster audits, while the risky branch offers higher overdrive. Peer Review at Scale is the first piece of this branch.
5. **More fantasy tech:** Black Hole HSM (keys cannot escape); Entangled Notary (both signatures agree until observed); Dream-Based Enrollment (your certificate was issued while you slept); Galactic Wildcard (finally covers *.universe).
6. **Measure the late-game curve:** record time to each new building, marginal payback and old-building contribution in a long simulated/playtested run. Consider a late Bulk Procurement upgrade that reduces price growth only after the player reaches large fleets, instead of changing the existing base prices now.

## Inspiration and differences

Cookie Clicker's [click upgrades](https://cookieclicker.wiki.gg/wiki/Cookies_per_Click) add a share of CPS to manual clicks. Its [Cursor upgrades](https://cookieclicker.wiki.gg/wiki/Cursor) link cursor value to other buildings. Its [Grandmapocalypse](https://cookieclicker.wiki.gg/wiki/Grandmapocalypse) advances through research and introduces risk/reward events; [wrinklers](https://cookieclicker.wiki.gg/wiki/Wrinkler) divert immediate production and repay more when collected. This version uses a single explicit backlog with modest bonuses, rather than Cookie Clicker's multiple-wrinkler collective payout mechanic.

## Validation

Run `npm test` for the economy and save-compatibility tests, and `npm run build` for TypeScript and the production bundle. Tests cover legacy rates, unique upgrade identifiers, prerequisites, ownership thresholds, both sides of links, late-game early-building value, click shares, rebellion stages, audit conservation/no duplicate payouts, containment, and ticks crossing threat/truce boundaries. The clock retains the existing five-second cap on a delayed tick; offline progress remains a separate feature.
