// ============================================================
//  Techno pattern reconstructed from the twothreetechno reel
//  ("Coding our next release, pt. 5")
//
//  HOW TO PLAY IT
//  1. Open https://strudel.cc in Chrome/Firefox
//  2. Select everything in the editor, delete it, paste this file
//  3. Ctrl+Enter (or Alt+Enter) to play. Ctrl+. (Alt+.) to stop.
//  4. Change a number, press Ctrl+Enter again. Nothing stops,
//     the change lands on the next cycle. That is the whole trick.
//
//  The reel used a private sample pack (kick, hats, clap, tr909_hh).
//  This version uses the sounds that strudel.cc ships by default, so
//  it plays without loading anything. Swap them later (see README).
// ============================================================

// One cycle = one bar of 4/4.  140 BPM  ->  35 cycles per minute.
setcpm(140/4)

// ---------- DRUMS ----------------------------------------------

// 4-on-the-floor. "t" = trigger, "~" = rest, 16 steps = 16th notes.
$: sound("bd:0")
  .bank("tr909")
  .struct("t ~ ~ ~ t ~ ~ ~ t ~ ~ ~ t ~ ~ ~")
  .gain(1.3)

// Off-beat hat: hits on the "and" of every beat.
// slice(16, "2") plays only the 3rd of 16 pieces of the sample,
// which turns a long hat into a short click.
$: sound("hh:2")
  .slice(16, "2")
  .struct("~ ~ t ~ ~ ~ t ~ ~ ~ t ~ ~ ~ t ~")
  .gain(0.8)

// Rolling 16th hats underneath, quieter.
$: sound("hh:0")
  .bank("tr909")
  .slice(32, "1")
  .struct("t t t t t t t t t t t t t t t t")
  .gain(0.4)

// Syncopated tom/perc. hpf removes its low end so it stays out of the kick's way.
// This line has 17 steps, exactly as in the reel: it drifts against the
// 16-step grid, which is where the groove comes from. Delete one "~" to lock it.
$: sound("perc:2")
  .bank("tr808")
  .struct("~ ~ ~ t ~ ~ t ~ ~ ~ ~ ~ t ~ ~ t ~")
  .hpf(250)
  .gain(0.6)

// Clap on beats 2 and 4.
$: sound("cp:1")
  .slice(16, "1")
  .struct("~ ~ ~ ~ t ~ ~ ~ ~ ~ ~ ~ t ~ ~ ~")
  .gain(0.8)

// Second, coarser clap. 8 steps here = 8th notes.
$: sound("cp:0")
  .slice(8, "1")
  .struct("~ ~ ~ ~ t ~ ~ ~")
  .gain(0.7)

// ---------- BASS -------------------------------------------------

// Reese bass: detuned saws through a ladder low-pass filter.
// The reel's line starts "d2 d2 d2 c#2 ...", the rest was off-screen.
$: note("d2 d2 d2 c#2 d2 d2 d2 f2")
  .s("sawtooth")
  .ftype("ladder")
  .lpf(400)
  .lpq(8)
  .lpenv(2)
  .lpdecay(0.15)
  .release(0.05)
  .clip(0.9)
  .gain(0.6)

// ---------- TRY LIVE (uncomment one line at a time, Ctrl+Enter) ----

// $: sound("oh:1").bank("tr909").struct("~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ t ~").gain(0.5)
// $: note("<d4 f4 a4 c5>*8").s("triangle").lpf(1200).delay(.5).delaytime(.375).room(.4).gain(.3)
