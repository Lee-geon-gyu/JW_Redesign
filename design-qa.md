# Investment grid revision — 2026-10-28

Status: PASS. No unresolved blocking design or interaction findings.

This latest revision supersedes the older Investment layout and manual-tab behavior recorded in the history below.

## Visual source and requested overrides

Target: `C:/Users/user/Downloads/모던 투자정보 기업 웹페이지.png` (1672×941).
User overrides: the card grid fills both viewport edges; Investment is left-aligned and slightly larger; small-card figures/year notes sit at bottom-left; UI text never renders below 12px.

Implemented a 2.1:1 desktop grid with one large left card and two equal stacked right cards. Rounded photo frames, large translucent index, white headings, cyan figures, and white link controls follow the reference. At small widths the large card sits above the two previews, retaining readable copy. Existing supplied sec-4 assets are retained by category: building, financial charts, and investor-relations book. No image files were modified.

## Browser verification and evidence

Browser plugin is unavailable; used the supported Codex in-app browser through CUA, including native wheel, pointer hold, horizontal drag, and keyboard input. No external browser process or app-state injection was used.

Installed project: `C:/Work_Portfolio_Items/Work_JW_Redesign/JW_Redesign_Web/`.
Preview: `http://127.0.0.1:4173/`, source asset version `20261028-32`.

Evidence in `C:/Users/user/Documents/Codex/2026-10-26/new-chat/outputs/`:
- `jw-investment-grid-final-desktop.png`
- `jw-investment-grid-final-mobile.png`
- `jw-investment-grid-comparison.jpg`
- `jw-investment-grid-audit.json`

Reported desktop viewport 1280×720, client width 1265. The grid spans x0–1265, y199.984–632. Heading computes to 64px and aligns left. Reported small viewport 364×672, client width 349. Its grid spans x0–349, y145.984–584.391. Heading computes to 32px. Native screenshots can have different pixel bounds from DOM viewport because of the capture surface; the JSON records DOM geometry, and the image sizes are recorded below.

## Interactions

- Native timed observation: `financial,shareholder,stock` changed after one autoplay interval to `shareholder,stock,financial`. Thus top-right becomes the left feature, the feature goes bottom-right, and bottom-right moves top-right. Frame positions/sizes tween over 950ms; body copy fades during the change.
- Pointer stays over a card while autoplay continues. A 6500ms pointer hold preserved `shareholder,stock,financial`; release resumed autoplay. Keyboard focus pauses autoplay so links can be used. Reduced-motion preference disables autoplay and parallax.
- Native horizontal drag changed `shareholder,stock,financial` to `stock,financial,shareholder`. Preview buttons promote their card; keyboard arrows also work. Current order persists when exiting/re-entering the section.
- Parallax observation: the main frame stayed exactly x0,y199.984,w860,h432 while its image changed from its initial transform to `translate3d(10.057px,-6.393px,0) scale(1.075)`. Only the photograph moves.
- Final focused source refinement limits pointer movement to 3% of card dimensions, capped at 14px horizontal and 11px vertical. Numeric bounds checks at 850×432,405×211,170×159 confirm movement remains within the photograph's 3.75% overscan on each edge. This prevents edge exposure on short/small cards and does not change the captured layout.

## Typography and integration

358 font-size declarations receive a max(12px,...) floor. The rem geometry base is retained; body text starts at 12px. Full installed DOM audits over text-bearing header/main/footer elements returned zero computed font sizes below 12px at both viewports. The floor also covers responsive overrides rather than relying only on Investment styles.

Header, loader, hero video/progress, R&D, pipeline, product, newsroom, Contact and footer behavior remain intact. The installed full-app flow was checked from intro through the expanded hero to footer, then back through Contact, Newsroom and Products into Investment. Existing entrance reveal targets still include the Investment grid. Horizontal Investment touch gestures are excluded from the vertical section-snap handler. Bottom spacing keeps preview arrows clear of the fixed TOP control.

Full installed desktop and small-screen console checks returned no errors or warnings. No duplicate HTML IDs; exactly three Investment cards. `node --check script.js` passes. All baseline checks and subsequent last-applied SHA256 guards passed, and installed source hashes matched the staged files. No deployment, dependency installation, or Git publication occurred.

## Findings resolved

- [P2, fixed] Bottom preview arrow could overlap fixed TOP: reserve 88px or more below the grid.
- [P2, fixed] Pointer-induced focus could leave autoplay stopped after a click: distinguish pointer mode from keyboard focus; pause while grabbed and resume on release.
- [P2, fixed] Fixed parallax travel could expose an image edge on short cards: bound travel by card size within image overscan.

No blocking follow-up remains.

Screenshot pixel sizes: {"jw-investment-grid-final-desktop.png": [1265, 712], "jw-investment-grid-final-mobile.png": [349, 644]}

---

# Prior revision history

# Section spacing, controls, and entrance motion — 2026-10-27

final result: passed

Installed-source CTA transitions, manual Investment selection, reveal behavior, and desktop/small-screen layout pass. No outstanding P0/P1/P2 finding in the changed surfaces.

## Scope and source truth

The latest user request modifies the existing design, rather than cloning the attached before-state screenshots. Its visual references are the eleven attachments in `C:/Users/user/AppData/Local/Temp/`:

- `codex-clipboard-0ea5469d-b740-4edb-89d9-fdd58e65a5a0.png` — existing Contact geometry.
- `codex-clipboard-80e4dcba-f8df-462e-b46e-9529a859d163.png` and `codex-clipboard-483cf330-e231-433e-bab0-dda2b0f1573b.png` — inquiry/news CTA shapes and existing excess right space.
- `codex-clipboard-f79378af-b2eb-4845-836e-bc4fa8838efe.png` and `codex-clipboard-a0a2cdd8-a7f2-4ef1-b2b4-0b2eb0fd638f.png` — product card and requested blue circular arrow.
- `codex-clipboard-266c6003-6db8-4a49-9f07-913f9358c530.png` and `codex-clipboard-caaabfa7-81ca-4462-86a1-acc99aa9cd07.png` — Investment surfaces/controls to remove.
- `codex-clipboard-b95e226e-136c-43de-a6d4-b9e6d9036ea1.png` and `codex-clipboard-c2bc8c42-0d0a-4904-a9ce-9560fa7aadcc.png` — pipeline grid and requested white circular arrow.
- `codex-clipboard-ccc80b09-82e0-4c99-b7e9-57f5319281ed.png` — R&D label/description gap to halve.
- `codex-clipboard-2bcd207c-944d-4009-8b8c-28ada10286fa.png` — hero line spacing to reduce.

Intentional changes from these before states: centered Contact; narrower, darker inquiry CTA; narrower newsroom CTA; icon-only product links; white/manual-only Investment; added pipeline affordance; reduced R&D and hero spacing; entrance motion. Existing image assets, fonts, primary/secondary tokens, URL destinations, product data, header behavior, video playback, and footer behavior are retained.

## Browser evidence

Browser plugin not available. Used the supported Codex in-app browser through CUA. No external browser or Playwright process was launched.

Preview: `http://127.0.0.1:4173/`. Source installed in `C:/Work_Portfolio_Items/Work_JW_Redesign/JW_Redesign_Web/`.
Evidence root: `C:/Users/user/Documents/Codex/2026-10-26/new-chat/outputs/`.

Reported desktop DOM viewport: 1280×720. Reported small DOM viewport: 364×672, with a 349px client width. Native screenshot pixel bounds are cataloged after final capture; they can differ from the reported viewport because of the app's capture surface and scrollbar gutter. Supplied screenshots include larger desktop frames and focused crops; comparison is feature/geometry based, and the requested numeric relationships are checked at the rendered viewport rather than treating different-size before screenshots as pixel-identical final designs.

Captured and reviewed: `jw-polish-hero-desktop.png`, `jw-polish-rnd-desktop.png`, `jw-polish-pipeline-hover.png`, `jw-polish-products-desktop.png`, `jw-polish-products-mobile.png`.

Final installed captures: `jw-polish-contact-final-desktop.png`, `jw-polish-contact-final-mobile.png`, `jw-polish-news-final-desktop.png`, `jw-polish-news-final-mobile.png`, `jw-polish-products-final-desktop.png`, `jw-polish-products-final-mobile.png`, `jw-polish-investment-final.png`. Contact/news/product desktop captures are 1265×712; Investment is 1265×720. Contact/news small captures are 349×672; Product small is 349×644. `jw-polish-contact-comparison.png` places the supplied before screenshot and the final centered implementation together, preserving each aspect ratio and explicitly labeling the different viewports. The same arrow assets/tokens and the requested numeric spacing relationships are checked separately in rendered DOM geometry.

## Measured results

- Hero at full expansion: row gap 13.578px, equal to 67% of the former 20.275px rendered gap. Progress-to-copy gap is 32.269px, three times the former 10.75px. Progress top remains y644.363, matching its original anchor formula. Both text rows move upward; the progress itself does not move.
- R&D active card: description margin is 23.68px at 1280px, half the former 47.36px. Since content keeps its bottom anchor and the description remains last, the category group moves down while the description stays in place. Mobile margin changes 14→7px.
- CTA intrinsic layout leaves a 22px right gap in the checked desktop states. News button measured 169.55px wide; inquiry measured 157.39px wide at this breakpoint. Existing type sizes are retained. Inquiry background alpha changes .16→.32, with .68 on the filled state.
- Contact photograph center matches the viewport midpoint, with a 0px desktop and -0.109px small-screen rounding difference. Desktop padding is the average of the former top/bottom pads, preserving the existing card height while centering it.
- Final desktop Contact card height is 479.75px, the same as before at this viewport. Small-screen card occupies y87.89–583.89; header ends at y73 and TOP begins at y608, so neither overlays the photograph. Small Contact and Products widths are exactly the 349px client viewport.
- Final small News heading ends at y139.17; button starts at y151.17 (12px separation) and ends within x328.38 of the 349px client. Cards end at y587.89, leaving 20px before TOP.
- Investment is white, has no side arrows or vertical English rail, and has no autoplay or drag handlers. Mouse click selects the requested tab; a subsequent horizontal drag leaves it unchanged; selected panel remains stable after waiting. Images shift 2vw right on desktop and 2% on small screens.
- Pipeline has ten white circular arrow elements with primary-blue arrow ink at each tile's right vertical center. The existing active-card memory is preserved.
- All product categories retain four product links plus the more-products link. Visible detail text is removed; all five cards have the blue round arrow, and product links retain accessible names and original destinations. Photos remain contain-fitted with original backgrounds.
- Product category change creates five registered reveal targets; category selection and carousel controls remain functional.

## Entrance motion

Seven section groups use section-entry observation. Text and cards fade up 34px over 850ms with gentle cubic easing and short stagger. Product navigation fades from 64px left toward its final position. Native individual `translate` animation preserves existing hover transforms, Swiper translation, hero motion and footer parallax. Reveal resets after a section fully exits, and new category cards register through a child-list observer. Reduced-motion preference bypasses the animation.

## Findings and fixes

1. [P2, fixed] A 4vw Investment artwork shift put the building under the right menu. Reduced it to the requested subtle 2vw shift.
2. [P2, fixed] Existing narrow-screen newsroom positioning overlapped the heading with the CTA. Place the button below the heading, and reserve bottom space for fixed TOP.
3. [P2, fixed] Legacy section minimum width exceeded the small client viewport. Bound Contact, Newsroom and Products to client width while preserving unrelated minimum-width rules.
4. [P2, fixed] CTA fill could miss a focus-modality change. Restart its 33%-crossing check on keyboard/left-transition start and measure actual arrow offsets instead of parsing calculated lengths.
5. [P2, fixed] Mobile Contact could touch the returning header and TOP. Retain symmetric padding but increase its small-screen minimum to 88px; final geometry and capture confirm clear margins on both sides.

A browser-owned comment overlay temporarily intercepted pointer input. It was identified by rendered hit testing and dismissed with Escape; no site styles were added for the overlay. After dismissal, real pointer click selected Investment panel 2 and a drag kept panel 2. Keyboard navigation also works. This was a verification-surface issue, not a site event-handler failure.

## Required fidelity surfaces

- Typography: existing display and body fonts are preserved. Numeric gap changes are applied only in the requested states; initial hero/loader typography remains unchanged. Product names retain wrapping and accessible link labels.
- Layout: source card geometry and radii are retained; Contact is centered; moving-label buttons size to their content; product arrow controls stay inside card corners; pipeline arrows are vertically centered. Narrow-screen title/button and TOP collisions are resolved.
- Colors: primary #0052F0, secondary #0068FF; white Investment canvas, white/blue pipeline circle, blue/white product circle, and slightly darker translucent-black inquiry CTA.
- Images/icons: all supplied raster assets are untouched. Existing library arrow assets are reused; no new approximate drawings or substitute photos were introduced.
- Copy: removed only visible product detail labels, Investment rail, and side controls. Product names, investment values, news items and Contact copy remain unchanged.

## Checks

- `node --check script.js` passes.
- Source SHA256 baseline guards passed before apply; copied source files matched staged files.
- No duplicate HTML IDs; exactly ten pipeline arrow elements; no old Investment arrow/rail markup.
- Primary flow: loader→expanded hero→R&D→pipeline→manual Investment→Products/category change→Newsroom→Contact.
- Existing mobile pipeline intentionally spans more than one viewport; section snapping preserves access to its remaining rows.
- Staged full-app console checks were clean. Final installed console and CTA checks remain below.

## Final installed interaction checks

- Both full apps reloaded from the actual project at asset version `20261027-31`.
- Contact CTA finishes with `is-filled=true`, black alpha .68 and a white circle; default alpha is .32. The 250ms color transition remains separate from arrow travel.
- News CTA finishes with `is-filled=true`, background rgb(0,82,240), and white circle. Default layout has a 22px right gap.
- Actual mouse click on Financial selects panel 2; `mode=manual`, `carouselRunning=false`. Earlier drag and elapsed-time checks kept the panel unchanged. No side controls or vertical rail exist in the DOM.
- Product detail links have empty visible text, five primary-blue circles, preserved URLs/accessibility labels, and five completed reveal targets. New-category cards also register and animate.
- Replay and reveal complete across R&D, pipeline, Investment, Products, Newsroom and Contact. Product navigation uses the rightward entrance rather than fade-up.
- Full desktop and small-screen installed console: no errors or warnings.
- Final source syntax check and staged/live copy verification pass. No image assets were modified.

## Follow-up polish

No blocking follow-up. The desktop/small screenshots are intentionally responsive representations rather than equal-size copies of the supplied before screenshots; the requested changes are the visual truth for modified spacing and controls.
