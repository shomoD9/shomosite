# Keeping glow in grayscale

Research fetched 18 October 2026. Companion implementation notes: [VectorCraft capability map](vectorcraft_capabilities.md).

Desaturation can remove glow because some of the separation between a light and its surroundings was carried by hue and saturation contrast. Equal-value colors then merge. Only luminance structure remains in strict grayscale. For this project's treatment, keep the source core at the brightest value, surround it with a continuous falloff gradient, and preserve deep darks beyond the spill. This is a practical design rule, rather than a claim that every luminous percept requires absolute white: glare research finds that surrounding gradients affect perceived brightness and self-luminosity, which are distinguishable percepts. [Tamura, Nakauchi and Koida, 2016](https://pubmed.ncbi.nlm.nih.gov/26790842/).

The eight techniques below are selected for control over core brightness, falloff, surrounding contrast, and texture. Numerical recipes are proposed starting values for this project, not values established by the cited papers or universal film simulations. Let **W** be final image width in pixels. A radius of 0.01W is 20 px in a 2000 px image. In VectorCraft use document width in points instead, then export scales the result. Opacities below are percentages; RGB tone values are 0–255.

## 1. Convert luminosity deliberately

**What:** Use a B&W adjustment or monochrome Channel Mixer to choose how source colors become gray. Equal averaging, `(R+G+B)/3`, makes equally saturated red, green and blue identical and discards their different luminances. True sRGB relative luminance requires linearizing the channels, computing `Y = 0.2126R + 0.7152G + 0.0722B`, then encoding Y back to sRGB for display. Applying those coefficients directly to encoded RGB is only a luma approximation. [W3C definition](https://www.w3.org/WAI/WCAG21/Understanding/relative-luminance.html).

**Why it works:** Preserving the light's separation from adjacent colors leaves tonal contrast available for the glow. Artistic channel mixing can strengthen that separation beyond a neutral conversion.

**Recipe:** Start with a B&W adjustment at 100% Normal, or Channel Mixer Monochrome at R30/G59/B11, constant 0. Compare individual channels. If an orange lamp becomes too dark, try R50/G40/B10; retain a total near 100% and check for lost highlight detail. Use a local mask if the same adjustment also brightens unrelated foliage or skin. Retain the color original until the tonal mix is settled. Adobe documents channel contribution controls and warns that excessive totals can remove highlight detail. [Adobe Channel Mixer](https://helpx.adobe.com/photoshop/desktop/adjust-color/selective-color-adjustments/create-monochrome-and-tinted-images-with-channel-mixer.html).

## 2. Preserve a sharp core and add separate bloom layers

**What:** Keep the original light intact and composite a softened copy of its bright region. Bloom is light spreading around bright sources; indiscriminate blur also softens unrelated scene detail. Dehancer's implementation separates source selection, spread, strength and highlight protection. [Dehancer Bloom](https://www.dehancer.com/learn/article/bloom).

**Why it works:** The core identifies the source; progressively dimmer spill suggests light scattering into surrounding space. Blurring the only copy weakens the core and its edge.

**Recipe:** Keep a small core at RGB 245–255. Extract highlights on a duplicate using Levels input black 190–220, white 245–255, with a feathered mask where needed. Make a tight bloom at Gaussian radius 0.003–0.008W and Screen 20–40%; add broad spill at 0.015–0.04W and Screen 5–20%. Keep a sharp core above the spill if the source needs restoring. For a drawn source, use white radial stops at radius fractions 0/0.25/0.6/1 with alpha 1/0.55/0.12/0.

Screen leaves black unchanged and brightens by multiplying inverse channel values. An Add/Linear Dodge glow layer sums channel values and clips more readily; start it at 5–15% and inspect the highlight boundary. Lighten selects brighter channel values and is less suited to continuous accumulation. These are different compositing operations, not interchangeable opacity settings. [Adobe blend modes](https://helpx.adobe.com/photoshop/using/blending-modes.html).

## 3. Dodge the light path and burn its surroundings

**What:** Locally lighten the source and illuminated surfaces; darken competing areas around them. Adobe exposes separate shadow, midtone and highlight ranges for Dodge/Burn and a Protect Tones option. [Adobe Dodge/Burn](https://helpx.adobe.com/photoshop/desktop/repair-retouch/adjust-light-tone/dodge-or-burn-image-areas.html).

**Why it works:** A brighter patch gains separation when nearby dark values remain available. Smooth transitions support a light-spill interpretation; a hard dark ring can look like an outline. The role of luminance ramps is supported by [glare research](https://pubmed.ncbi.nlm.nih.gov/26790842/); the following editing prescription is an application of that finding.

**Recipe:** Work on a duplicate or separate adjustment layers. Use a soft brush, hardness 0%, exposure 3–8%, building passes. Dodge facing surfaces by roughly +0.2 to +0.5 EV; burn competing surroundings by −0.3 to −0.8 EV with masks feathered 0.03–0.08W. For vectors, use white-to-transparent Screen shapes at 5–15% and black-to-transparent Multiply shapes at 10–30%. Preserve a dark background around RGB 5–25 where the scene permits. Do not increase Clarity across the bloom: it can steepen or ring the very gradient being built.

## 4. Add tight halation separately from broad bloom

**What:** Film halation comes from light spreading/reflection in the film system and can appear as a local halo at bright, contrasting boundaries. Color-film emulations often produce a red-orange fringe. CineStill explains that remjet protects against halation and that its films omit that backing; its FAQ says the color films are correspondingly more susceptible. This does not mean every B&W stock lacks an anti-halation layer. [CineStill Remjet](https://help.cinestillfilm.com/hc/en-us/articles/360028874012-What-is-Remjet), [CineStill FAQ](https://cinestill.film/pages/frequently-asked-questions).

**Why it works:** A small fringe close to a luminous boundary supplies a second spatial scale of spill. Its hue is unavailable after full grayscale conversion, so preserve the fringe's luminance and geometry. Dehancer treats source brightness, background darkness and diffusion as separate halation controls. [Dehancer Halation](https://www.dehancer.com/learn/article/halation).

**Recipe:** Isolate the brightest sources with a soft highlight mask starting around 210–235. Blur a duplicate 0.0015–0.006W; constrain it to the edge neighborhood rather than the entire photo rectangle. Composite Screen 10–25%, using neutral light gray for strict B&W. For a CineStill-inspired desaturated variant, use muted orange `#d58d68` at 5–12%, under a near-white core; keep a broader, weaker neutral bloom underneath. A vector Outer Glow follows silhouette alpha, so apply it to a traced/drawn source, not an opaque photograph's frame. This is a visual approximation, not a calibrated CineStill stock model.

## 5. Use restrained Orton softness for atmosphere

**What:** Combine sharp detail with a softened tonal image. The historical Orton process combined slide exposures, including a sharp exposure and a defocused exposure; digital versions differ. Robin Whalley's tutorial uses a blurred copy, Levels contrast, low opacity, and a separate detail-restoration layer. [Lenscraft Orton tutorial](https://lenscraft.co.uk/photo-editing-tutorials/orton-effect/).

**Why it works:** The original retains readable edges while the blurred component links nearby highlights into a larger atmospheric field. Applying too much erases texture and flattens depth.

**Recipe:** Above the sharp base, duplicate the finished monochrome image. Gaussian blur 0.005–0.015W. Increase contrast on this copy with Levels input black 10–25, white 225–245, gamma 1.0–1.15. Start at Normal 10–15%, matching the low-opacity tutorial approach. Screen 5–15% is a brighter modern variant; Multiply 10–20% gives a denser slide-sandwich variant and may require brightening the blurred copy first. Mask text, eyes, fine linework and the tiny source core out of the soft layer. Prefer source-specific bloom when only one lamp should glow.

## 6. Retain very slight warm highlights and cool shadows

**What:** Split tone the monochrome base, with separate highlight and shadow colors. This produces a desaturated image rather than strict B&W. Adobe's Color Grading controls allow tonal ranges to overlap and leave pure black/white untinted unless their luminance is changed. [Adobe Color Grading](https://blog.adobe.com/en/publish/2020/10/20/introducing-color-grading).

**Why it works:** Small color differences restore some separation between illumination and the dark environment without replacing the grayscale tonal hierarchy. Warm versus cool is an artistic cue, not a universal law about light temperature.

**Recipe:** In Lightroom Color Grading, begin highlights H40–50/S4–8, shadows H215–230/S3–6, midtones S0, Blending 40–60, Balance 0 to +10. Keep the peak source neutral. Alternatively use two low-saturation tint layers in Color mode, 5–10%, with complementary luminosity masks; fade each through the midtones. For a final strictly grayscale deliverable, omit these tints and assess luminance alone.

## 7. Keep grain in shadows and midtones; protect the light

**What:** Apply monochrome grain through a tonal mask that excludes highlights and bloom. Dehancer provides separate grain strengths for shadows, midtones and highlights, and distinguishes negative and positive grain responses. Highlight exclusion is a design choice here, not a rule that real film has no highlight grain. [Dehancer Film Grain](https://www.dehancer.com/learn/article/grain).

**Why it works:** Smooth bright regions preserve the uninterrupted gradient of the light, while textured darker surfaces supply a material contrast. Grain crossing the source can make it appear like another textured object.

**Recipe:** On a duplicate of the image, add monochrome noise around 1–3% at final size, or use a neutral-gray grain layer in Soft Light/Overlay at 10–25%. Aim for grains about 0.0004–0.001W across; inspect at delivery size. Multiply the effect's opacity by a mask that is white below luminance 160–180, tapers to black at 220–235, and stays black above it. Also paint out the source's broad halo if its values fall below that threshold. Feather spatial corrections 0.005–0.02W. Apply before the final clean glow layers. Invert a grayscale image and tighten its Levels to build the tonal mask; a white mask reveals and a black mask conceals.

## 8. Borrow film exposure and diffusion decisions

**What:** Previsualize the light's final print value, then expose and print accordingly. In the classic eleven-zone terminology, Zone IX approaches white without texture and Zone X is paper white, including light sources and specular glare. Tom Ferguson reproduces these definitions and explains the one-stop exposure spacing. [Ferguson Zone System tutorial](https://www.ferguson-photo-design.com/alternative/tutorial-a06.php).

**Why it works:** Reserving the highest print values for the source gives the surrounding tones room to describe its falloff. Film exposure, development, print contrast and local dodging/burning jointly determine this rendering. Zones are not equally spaced 8-bit RGB values.

**Recipe:** In previsualization, place the source at IX/X, textured illuminated surfaces at VII/VIII, and required shadow texture around III. A spot reading places a subject at V; rendering that metered subject at IX/X conceptually requires +4/+5 stops relative to its reading. Do not apply that offset to a whole scene without checking shadow exposure and the film/development range. In a digital reconstruction, use a small 245–255 core and a smooth shoulder rather than lifting the entire exposure.

For capture tests, bracket Pro-Mist or Black Pro-Mist at 1/8 and 1/4 strength with matched exposure. Pro-Mist-type diffusion spreads highlights; Black Pro-Mist is designed to retain more shadow contrast than Pro-Mist while controlling highlight flare. Strong flare can veil the darks and reduce separation, so compare source placement and use a hood/flags for unwanted off-frame light. Tiffen describes contained highlight flare and less shadow lightening for Black Pro-Mist. [Tiffen Black Pro-Mist](https://tiffen.com/products/6-6x6-6-black-pro-mist-filter). A software starting approximation is a sharp base plus bloom at 0.005–0.02W, Screen 10–25%, with no global black lift; these numbers do not correspond to filter strengths.

## Sources

All links below were fetched during this research, rather than copied from unvisited search snippets.

- [Tamura, Nakauchi and Koida (2016), brightness and self-luminosity in the glare illusion](https://pubmed.ncbi.nlm.nih.gov/26790842/).
- [W3C, sRGB relative luminance definition](https://www.w3.org/WAI/WCAG21/Understanding/relative-luminance.html).
- [Adobe, monochrome Channel Mixer](https://helpx.adobe.com/photoshop/desktop/adjust-color/selective-color-adjustments/create-monochrome-and-tinted-images-with-channel-mixer.html).
- [Adobe, blending mode descriptions](https://helpx.adobe.com/photoshop/using/blending-modes.html).
- [Adobe, Dodge/Burn](https://helpx.adobe.com/photoshop/desktop/repair-retouch/adjust-light-tone/dodge-or-burn-image-areas.html).
- [Dehancer, Bloom](https://www.dehancer.com/learn/article/bloom).
- [Dehancer, Halation](https://www.dehancer.com/learn/article/halation).
- [CineStill, What is Remjet?](https://help.cinestillfilm.com/hc/en-us/articles/360028874012-What-is-Remjet).
- [CineStill, FAQ](https://cinestill.film/pages/frequently-asked-questions).
- [Robin Whalley/Lenscraft, Orton effect](https://lenscraft.co.uk/photo-editing-tutorials/orton-effect/).
- [Adobe imaging team, Introducing Color Grading](https://blog.adobe.com/en/publish/2020/10/20/introducing-color-grading).
- [Dehancer, Film Grain](https://www.dehancer.com/learn/article/grain).
- [Tom Ferguson, Zone System, Part 2](https://www.ferguson-photo-design.com/alternative/tutorial-a06.php).
- [Tiffen, Black Pro-Mist product explanation](https://tiffen.com/products/6-6x6-6-black-pro-mist-filter).
