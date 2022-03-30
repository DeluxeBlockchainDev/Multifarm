import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'

import content from '../privacy.md'
import { Markdown } from '../styled'

export default function PrivacyPolicy() {
  const [md, setMd] = useState('')

  useEffect(() => {
    fetch(content)
      .then((res) => res.text())
      .then((res) => setMd(res))
  }, [])

  return (
    <Markdown>
      <ReactMarkdown>{md}</ReactMarkdown>
    </Markdown>
  )
}
