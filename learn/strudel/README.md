# Learn Strudel: live-code techno while you type

The screenshot you sent is [Strudel](https://strudel.cc), a JavaScript port of
TidalCycles. It runs in the browser, needs no install, and re-evaluates your code
while the music keeps playing. This folder has:

- `README.md` (this file): the language, in the order you need it
- `techno.js`: the pattern from the reel, rebuilt with the sounds strudel.cc ships,
  so it plays the moment you paste it

## 0. Play something in 60 seconds

1. Open https://strudel.cc.
2. Replace the editor contents with:
   ```js
   sound("bd hh sd hh")
   ```
3. Press **Ctrl+Enter** (Alt+Enter also works). You hear a beat.
4. Change it to `sound("bd hh sd [hh hh]")` and press Ctrl+Enter again.
   The music does not stop. The new version takes over at the next cycle.
5. **Ctrl+.** (Alt+.) stops everything.

That loop of edit, Ctrl+Enter, listen, edit is the entire practice of live coding.
Every section below just gives you more things to type between those key presses.

## 1. The mental model: cycles, not bars

Strudel has no timeline. There is one **cycle** that repeats forever, and every
string you write is squeezed into that cycle. `"bd sd"` puts two events in one
cycle, `"bd sd hh cp"` puts four in the same amount of time. By default one cycle
lasts about a second. Set the tempo once at the top:

```js
setcpm(140/4)   // 140 BPM in 4/4: one cycle = one bar
```

## 2. Mini-notation: the language inside the quotes

Everything in the reel lives in strings like `"t ~ ~ ~ t ~ ~ ~"`. That string
syntax is called mini-notation. These symbols cover almost everything you will use:

| Symbol | Meaning | Example |
|---|---|---|
| space | sequence, events share the cycle equally | `"bd sd hh cp"` |
| `~` | rest (silence) | `"bd ~ sd ~"` |
| `[ ]` | subdivide one step | `"bd [hh hh] sd hh"` |
| `< >` | alternate: one item per cycle | `"bd <sd cp>"` |
| `*n` | repeat n times inside its step | `"hh*8"` |
| `/n` | stretch over n cycles | `"[bd sd]/2"` |
| `!n` | replicate as separate steps | `"bd!4"` |
| `?` | 50% chance to drop | `"hh*8?"` |
| `@n` | make a step n times longer | `"bd@3 sd"` |
| `,` | play layers at once | `"bd*4, hh*8"` |
| `(k,n)` | Euclidean rhythm, k hits over n steps | `"bd(3,8)"` |
| `name:i` | pick variant i of a sound | `"hh:2"` |
| `\|` | random choice per cycle | `"bd \| sd"` |

Try each one in `sound("...")` before moving on. The reel author uses only the
first two plus `:` but writes them out longhand for readability.

## 3. Sounds

```js
sound("bd sd hh oh cp rim lt mt ht cr rd")   // built-in drum kit, no loading
sound("bd:3")                                // 4th sample of the bd folder
sound("bd sd hh").bank("tr909")              // same names, Roland TR-909 samples
sound("bd sd hh").bank("tr808")              // TR-808. Also tr707, LinnDrum, EmuSP12
sound("sawtooth square triangle sine")       // synth waveforms, use with note()
```

`s()` is a shorter alias for `sound()`. The reel's `kick`, `hats`, `clap`,
`tr909_hh` are that duo's private sample pack. To load your own:

```js
samples({ kick: 'kick.wav', hats: ['hat1.wav', 'hat2.wav'] }, 'https://your-host/')
samples('github:user/repo')   // a repo with a strudel.json sample map
```

## 4. The chain: how the reel is built

Every line in the reel is one instrument, written as a chain of methods:

```js
$: sound("hh:2")                                    // pick the sound
  .slice(16, "2")                                   // play only piece 2 of 16
  .struct("~ ~ t ~ ~ ~ t ~ ~ ~ t ~ ~ ~ t ~")        // WHEN it fires
  .gain(0.8)                                        // how loud
```

- **`$:`** starts an independent pattern. Stack as many as you like. The reel uses
  `let hat = ...` then presumably a `stack(...)` at the bottom; `$:` is the modern
  shorthand and lets you mute a line by writing `_$:` instead.
- **`.struct("t ~ t")`** imposes rhythm. `t` fires the sound, `~` stays silent.
  16 tokens = 16th notes, 8 tokens = 8th notes. Reading the reel:
  - kick `t ~ ~ ~ t ~ ~ ~ t ~ ~ ~ t ~ ~ ~` = four on the floor
  - hat `~ ~ t ~ ...` = off-beats
  - clap `~ ~ ~ ~ t ~ ~ ~ ~ ~ ~ ~ t ~ ~ ~` = beats 2 and 4
- **`.slice(n, "i")`** cuts the sample into n pieces and plays piece i. On a
  drum hit it works as a transient shaper: `slice(16, "2")` skips the click at the
  start and gives a shorter, tighter hat. Try `"0"` vs `"2"` vs `"5"` live.
- **`.gain(x)`**: 1 is normal, the kick sits at 1.3, hats at 0.4 to 0.8.

## 5. Shaping the sound

| Method | What it does | Typical techno value |
|---|---|---|
| `.hpf(hz)` | high-pass, removes lows | `250` on percs so the kick owns the bass |
| `.lpf(hz)` | low-pass, removes highs | `400` to `2000` on bass and pads |
| `.lpq(q)` | filter resonance, 0 to 50 | `5` to `12` |
| `.ftype("ladder")` | Moog-style aggressive filter | pair with `.lpf` for reese bass |
| `.lpenv(n)` | filter envelope depth | `2` to `8` for a "wow" attack |
| `.room(x)` | reverb amount 0 to 1 | `.2` on claps |
| `.delay(x)` | delay send 0 to 1 | `.5` with `.delaytime(.375)` = dotted 8th |
| `.distort(x)` | wave-shaping distortion | `1` to `3` on kicks |
| `.speed(x)` | sample playback rate | `.8` for a lower kick |
| `.pan(x)` | 0 left, 1 right | `sine.slow(4)` to auto-pan |
| `.attack/.release` | amp envelope in seconds | `.release(.05)` for tight bass |

Numbers can be patterns too. `.lpf("<400 800 1600>")` opens the filter a step
per cycle. `.lpf(sine.range(300, 3000).slow(8))` sweeps it continuously.

## 6. Notes and bass

```js
$: note("d2 d2 d2 c#2 d2 d2 d2 f2")   // note names, octave 2 = bass
  .s("sawtooth")
  .ftype("ladder").lpf(400).lpq(8)
  .lpenv(2).release(.05)
```

That is the reel's `reese`. Shortcuts for melody: `note("0 3 7".scale("D:minor"))`
picks scale degrees, `note("d2").add("<0 0 3 5>")` transposes per cycle,
`n(irand(8)).scale("D:minor")` improvises.

## 7. Playing live: the moves that make it music

Type these one at a time on an already-running pattern and press Ctrl+Enter.

1. **Mute and unmute.** Change `$:` to `_$:`. Bring the kick back on a downbeat.
2. **Fill every 4th bar.** `.every(4, x => x.fast(2))` on the hats.
3. **Chance.** `.sometimesBy(.2, x => x.speed(2))` or `"hh*16?"`.
4. **Build.** `.hpf("<100 400 1200 3000>")` on the whole drum group, then jump back to `100`.
5. **Stereo trick.** `.jux(rev)` plays the reversed pattern in the right ear only.
6. **Swing.** `.swing(4)` on hats.
7. **Turn a hit into a roll.** `.ply("<1 1 1 4>")`.
8. **Layer a chord stab.** `$: note("<[d3,f3,a3] ~>").s("square").lpf(1500).release(.2)`

Change one thing per Ctrl+Enter. A wrong evaluation does not crash the set; the
last working pattern keeps playing until the next good one.

## 8. Practice plan

| Day | Goal |
|---|---|
| 1 | Paste `techno.js`, mute lines with `_$:`, unmute them in a build |
| 2 | Rewrite every `.struct("t ~ ...")` using `*`, `[ ]` and `(k,n)` |
| 3 | Replace `bd`/`hh`/`cp` with `.bank("tr808")`, then `"tr909"`, then `"LinnDrum"` |
| 4 | Automate one filter per instrument with `sine`, `saw`, `perlin` |
| 5 | Write a 4-cycle arrangement with `<a b c d>` and `.every()` |
| 6 | Load your own sample pack with `samples()` and rebuild the reel's kit |
| 7 | Play a 10-minute set from a blank editor without stopping the transport |

## Reference

- REPL and docs: https://strudel.cc (workshop tab walks through the same steps with sound)
- Function reference: https://strudel.cc/learn (samples, effects, time modifiers)
- Keys: Ctrl+Enter evaluate, Ctrl+. stop, Alt+w / Alt+q jump between `$:` blocks
- Everything here was checked against `@strudel/core` 1.2.6 and `@strudel/webaudio` 1.3.0
