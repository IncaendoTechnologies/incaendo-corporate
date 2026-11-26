# Hero

The opening section of a web page: an `inc-eyebrow`, an `inc-hero-title` (the page's only `h1`) that names the outcome for the client, one `inc-hero-lead` sentence, and two buttons (primary "Book a call" and a secondary). On the right, an `inc-hero-panel` (navy, `radius-lg`) with three `Stat`s and one note line, or an `inc-hero-media` frame holding a real product screenshot.

**The consumer provides** `<section class="inc-hero">` inside an `inc-shell` wrapper, then `inc-container` and `inc-hero-grid` with two children: `inc-hero-copy` and either `inc-hero-panel` or `inc-hero-media`. Put one or two words of the title in `<span class="inc-highlight">` for the orange accent.

**Sizes:** the title is 36/44 on phones and 64/72 (`web-display`) from 1024px; the lead is 18/28, then 20/30 from 768px. The panel stacks below the copy on phones, shows its stats in a row on tablets, and sits beside the copy on desktop.

**Content:** only approved facts (500+ projects, since 2012, 50+ team, clients in the UK, UAE, Indonesia, the US and Europe). Real screenshots only, no stock photos or AI images. One hero per page.

Do: keep the title under ten words and the lead to one sentence. Don't: put text over a photo, use a background video, or highlight more than one phrase.
