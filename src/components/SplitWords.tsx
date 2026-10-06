import { Fragment } from 'react'

// As palavras animadas ficam escondidas do leitor de tela; ele lê a frase inteira no .sr-only.
export function SplitWords({ text, className, wordClassName = '' }: { text: string; className?: string; wordClassName?: string }) {
  const words = text.split(' ')
  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      {words.map((word, i) => (
        <Fragment key={i}>
          <span className="wm" aria-hidden>
            <span className={`w ${wordClassName}`}>{word}</span>
          </span>
          {i < words.length - 1 && <span aria-hidden> </span>}
        </Fragment>
      ))}
    </span>
  )
}
