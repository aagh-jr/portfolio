// PORTFOLIO PREVIEW: a phone on the same stage and frame as the quiz phones
// (ChatQuiz's QuizNeedsPhone / QuizSectionPhone). With `src`, the screen is a
// full-screen screenshot (its own status bar included, so the frame's is off);
// without it, the screen is blank, a stand-in until the real one is built.
// Not app code.
import { Stage } from '../../stageshow/kit/stage'
import { Phone } from '../../stageshow/kit/phone'
import './binu.css'
import './chat-quiz.css'

export function EmptyPhone({ src }: { src?: string }) {
  return (
    // A 326-wide phone is ~686 tall: with a screenshot the stage shows all of it
    // (16px margin top and bottom); the blank phone keeps the quiz phones' 520 crop
    <Stage<object> width={358} height={src ? 718 : 520} className="binu cq cq--phone">
      {() =>
        src ? (
          <Phone width={326} className="cq-phone" status={false} wallpaper={`#000 url("${src}") center top / cover no-repeat`} />
        ) : (
          <Phone width={326} className="cq-phone">
            <div style={{ height: '100%', background: '#fff' }} />
          </Phone>
        )
      }
    </Stage>
  )
}
