# Binu previews

Animated faux UI for the portfolio case study. Not app code. Every page is a
full-width preview (`<Name>Page`, designed at 1440 × 757, the whole desktop
screen) plus one or more close-up tiles (`<Name>Tile`, 480 × 322). Each one
also has a phone design for narrow containers.

| File | What it is | Exports |
|---|---|---|
| `ChatQuiz.tsx` + `chat-quiz.css` | Onboarding chat quiz | `QuizPage`, `QuizTile`, `QuizSectionTile`, `QuizNeedsTile`, `QuizSavedTile` |
| `ProductPage.tsx` + `product-page.css` | Product page: press an ingredient, its card changes | `ProductPage`, `ProductTile` |
| `RoutinePage.tsx` + `routine-page.css` | Routine editor: add a retinal serum, the clash check flags it | `RoutinePage`, `RoutineTile` |
| `HomeSearchPage.tsx` + `home-search-page.css` | Signed-in home: search "niacinamide", results drop in | `HomeSearchPage`, `HomeSearchTile` |
| `ForYouPage.tsx` + `for-you-page.css` | For You: Price re-weighs the picks for value | `ForYouPage`, `ForYouTile` |
| `binu.css` | Shared palette, fonts and nav styles | — |
| `icons.tsx` | Lucide icons inlined (lucide-react isn't a portfolio dependency) | icon components |
| `fonts/` | Hanken Grotesk and Newsreader, self-hosted so the first frame has the real faces | — |
| `img/` | Product pack shots and the quiz scientist avatar, from the Binu catalogue / app assets | — |
