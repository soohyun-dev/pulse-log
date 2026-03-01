import { siteConfig } from '@/lib/constants'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About',
  description: 'Pulse에 대하여',
}

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-bold mb-8">About</h1>

      <div className="prose">
        <section className="mb-12">
          <h2>안녕하세요!</h2>
          <p>
            <strong>Pulse</strong>입니다. 개발하면서 배우고 경험한 것들을 이곳에 기록합니다.
          </p>
        </section>

        <section className="mb-12">
          <h2>이력</h2>
          <div className="space-y-6 not-prose">
            <CareerItem
              company="Company Name"
              role="Frontend Developer"
              period="2024.01 - 현재"
              description="주요 업무 및 기여 내용을 작성해주세요."
            />
          </div>
        </section>

        <section className="mb-12">
          <h2>기술 스택</h2>
          <div className="flex flex-wrap gap-2 not-prose">
            {['TypeScript', 'React', 'Next.js', 'Tailwind CSS', 'Node.js'].map((skill) => (
              <span
                key={skill}
                className="rounded-full bg-muted px-3 py-1 text-sm text-muted-foreground"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>

        <section>
          <h2>연락처</h2>
          <ul>
            <li>
              GitHub:{' '}
              <a href={siteConfig.links.github} target="_blank" rel="noopener noreferrer">
                {siteConfig.links.github}
              </a>
            </li>
          </ul>
        </section>
      </div>
    </div>
  )
}

function CareerItem({
  company,
  role,
  period,
  description,
}: {
  company: string
  role: string
  period: string
  description: string
}) {
  return (
    <div className="border-l-2 border-accent/50 pl-4">
      <div className="flex items-baseline justify-between gap-4">
        <div>
          <h3 className="font-semibold">{company}</h3>
          <p className="text-sm text-muted-foreground">{role}</p>
        </div>
        <span className="text-xs text-muted-foreground whitespace-nowrap">{period}</span>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    </div>
  )
}
